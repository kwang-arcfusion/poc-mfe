// remotes/ask_ai/src/hooks/useSimulatedStreaming.ts
import { useState, useRef, useCallback } from 'react';
import type { AssetGroup } from '../types';

export type StreamStatus = 'idle' | 'streaming' | 'completed' | 'error';

export type JsonEvent =
  | { seq: number; type: 'answer.delta'; payload: { text: string } }
  | { seq: number; type: 'assets.push'; payload: AssetGroup }
  | { seq: number; type: 'done' }
  | { seq: number; type: 'error'; payload: { message: string } };

/** ---------- EventInput: a union that explicitly omits seq ---------- */
type AnswerDeltaInput = { type: 'answer.delta'; payload: { text: string } };
type AssetsPushInput = { type: 'assets.push'; payload: AssetGroup };
type DoneInput = { type: 'done' };
type ErrorInput = { type: 'error'; payload: { message: string } };
type EventInput = AnswerDeltaInput | AssetsPushInput | DoneInput | ErrorInput;

// --- Mock data ------------------------------------------------------------
const lorem1 =
  'Based on the data from last week, CTR increased midweek before dipping on the weekend. ' +
  "Let's dig into which segments and creatives drove that change.";

const group1: AssetGroup = {
  id: 'grp1',
  sqls: [
    {
      id: 'sql1',
      title: 'Top CTR Segments',
      sql: `-- Segments with CTR above average
SELECT segment, ROUND(ctr*100, 2) AS ctr_pct
FROM agg_ctr_by_segment
WHERE date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND CURRENT_DATE()
ORDER BY ctr DESC
LIMIT 10;`,
    },
  ],
  dataframes: [
    {
      id: 'df1',
      title: 'CTR by Day',
      columns: ['Day', 'CTR%'],
      rows: [
        ['Mon', 1.5],
        ['Tue', 1.7],
        ['Wed', 2.1],
        ['Thu', 1.9],
        ['Fri', 1.6],
        ['Sat', 1.3],
        ['Sun', 1.2],
      ],
    },
    {
      id: 'df2',
      title: 'Top Creatives',
      columns: ['Creative', 'CTR%'],
      rows: [
        ['Video C', 2.5],
        ['Image A', 2.0],
        ['Carousel B', 1.8],
      ],
    },
  ],
  charts: [
    {
      id: 'chart1',
      title: 'CTR% by Day',
      type: 'bar',
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [1.5, 1.7, 2.1, 1.9, 1.6, 1.3, 1.2],
    },
  ],
};

const lorem2 =
  "Here's a deeper dive into underperforming campaigns and budget pacing. " +
  'Consider reallocating spend to high-CTR segments for the next sprint.';

const group2: AssetGroup = {
  id: 'grp2',
  sqls: [
    {
      id: 'sql2',
      title: 'Underperforming Campaigns',
      sql: `-- Campaigns below 1.2% CTR last 7 days
SELECT campaign, ROUND(ctr*100,2) AS ctr_pct, impressions
FROM agg_ctr_by_campaign
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY) AND ctr < 0.012
ORDER BY ctr ASC
LIMIT 10;`,
    },
  ],
  dataframes: [
    {
      id: 'df3',
      title: 'Budget vs CTR',
      columns: ['Campaign', 'Budget($k)', 'CTR%'],
      rows: [
        ['Summer Sale A', 20, 0.9],
        ['Always On B', 15, 1.1],
        ['Brand Lift C', 10, 1.0],
      ],
    },
  ],
  charts: [
    {
      id: 'chart2',
      title: 'Budget ($k)',
      type: 'bar',
      labels: ['A', 'B', 'C'],
      values: [20, 15, 10],
    },
  ],
};

// --- Hook: JSON Event Streaming ------------------------------------------
export function useJsonEventStreaming() {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [lastEvent, setLastEvent] = useState<JsonEvent | null>(null);
  const [events, setEvents] = useState<JsonEvent[]>([]);
  const [sseLines, setSseLines] = useState<string[]>([]); // debug: "data: {...}"

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const seqRef = useRef(0);

  // Use EventInput instead of Omit<JsonEvent,'seq'> to avoid excess property checks on union
  const emit = useCallback((e: EventInput) => {
    const evt: JsonEvent = { ...(e as any), seq: ++seqRef.current };
    setLastEvent(evt);
    setEvents((prev) => [...prev, evt]);
    setSseLines((prev) => [...prev, `data: ${JSON.stringify(evt)}`]);
  }, []);

  const startStreaming = useCallback(() => {
    if (timerRef.current) return;
    setStatus('streaming');
    setLastEvent(null);
    setEvents([]);
    setSseLines([]);
    seqRef.current = 0;

    // build a schedule: text → assets → text → assets → done
    const tokens1 = lorem1.split(/(\s+)/).filter(Boolean);
    const tokens2 = lorem2.split(/(\s+)/).filter(Boolean);

    const schedule: Array<{ after: number; run: () => void }> = [];
    let t = 0;

    tokens1.forEach((tok) => {
      schedule.push({
        after: (t += 40),
        run: () => emit({ type: 'answer.delta', payload: { text: tok } }),
      });
    });

    schedule.push({
      after: (t += 200),
      run: () => emit({ type: 'assets.push', payload: group1 }),
    });

    tokens2.forEach((tok) => {
      schedule.push({
        after: (t += 40),
        run: () => emit({ type: 'answer.delta', payload: { text: tok } }),
      });
    });

    schedule.push({
      after: (t += 200),
      run: () => emit({ type: 'assets.push', payload: group2 }),
    });

    schedule.push({ after: (t += 80), run: () => emit({ type: 'done' }) });

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      while (schedule.length && schedule[0].after <= elapsed) {
        const task = schedule.shift()!;
        task.run();
      }
      if (schedule.length === 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setStatus('completed');
      }
    };

    timerRef.current = setInterval(tick, 16);
  }, [emit]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setStatus('idle');
    setLastEvent(null);
    setEvents([]);
    setSseLines([]);
    seqRef.current = 0;
  }, []);

  return { status, startStreaming, reset, lastEvent, events, sseLines };
}

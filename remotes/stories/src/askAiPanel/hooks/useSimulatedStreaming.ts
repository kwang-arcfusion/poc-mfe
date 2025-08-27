// remotes/stories/src/askAiPanel/hooks/useSimulatedStreaming.ts
import { useState, useRef, useCallback } from 'react';
import type { AssetGroup } from '../types';

export type StreamStatus = 'idle' | 'streaming' | 'completed' | 'error';

export type JsonEvent =
  | { seq: number; type: 'answer.delta'; payload: { text: string } }
  | { seq: number; type: 'assets.push'; payload: AssetGroup }
  | { seq: number; type: 'done' }
  | { seq: number; type: 'error'; payload: { message: string } };

type AnswerDeltaInput = { type: 'answer.delta'; payload: { text: string } };
type AssetsPushInput = { type: 'assets.push'; payload: AssetGroup };
type DoneInput = { type: 'done' };
type ErrorInput = { type: 'error'; payload: { message: string } };
type EventInput = AnswerDeltaInput | AssetsPushInput | DoneInput | ErrorInput;

// --- Mock data (เหมือนเดิม) ---
const lorem1 =
  "Let's break down the conversion drop. The primary issue seems to be at the checkout stage, specifically on mobile devices after the OTP verification was implemented.";
const group1: AssetGroup = {
  id: 'grp1',
  sqls: [],
  dataframes: [
    {
      id: 'df1',
      title: 'Funnel Drop-off (Mobile)',
      columns: ['Step', 'Users (Before)', 'Users (After)', 'Drop-off %'],
      rows: [
        ['Add to Cart', 660, 640, '-3%'],
        ['Checkout Start', 380, 380, '0%'],
        ['OTP Verified', 350, 45, '-87%'],
        ['Purchase', 345, 42, '-88%'],
      ],
    },
  ],
  charts: [],
};
const lorem2 =
  'The data confirms a significant increase in user abandonment. Focusing on optimizing the OTP flow or providing alternative verification methods on mobile is the highest priority action.';

// --- Hook: JSON Event Streaming (เหมือนเดิม) ---
export function useJsonEventStreaming() {
  const [status, setStatus] = useState<StreamStatus>('idle');
  const [lastEvent, setLastEvent] = useState<JsonEvent | null>(null);
  const timerRef = useRef<any | null>(null);
  const seqRef = useRef(0);

  const emit = useCallback((e: EventInput) => {
    const evt: JsonEvent = { ...(e as any), seq: ++seqRef.current };
    setLastEvent(evt);
  }, []);

  const startStreaming = useCallback(() => {
    if (timerRef.current) return;
    setStatus('streaming');
    setLastEvent(null);
    seqRef.current = 0;

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
    schedule.push({ after: (t += 80), run: () => emit({ type: 'done' }) });

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      while (schedule.length && schedule[0].after <= elapsed) {
        schedule.shift()!.run();
      }
      if (schedule.length === 0) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setStatus('completed');
      }
    };
    timerRef.current = setInterval(tick, 16);
  }, [emit]);

  return { status, startStreaming, lastEvent };
}

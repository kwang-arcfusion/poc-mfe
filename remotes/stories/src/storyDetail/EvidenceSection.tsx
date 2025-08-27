// remotes/stories/src/storyDetail/EvidenceSection.tsx
import * as React from 'react';
import { Card, Text, makeStyles, shorthands } from '@fluentui/react-components';
import { TrendChart, TrendPoint } from './TrendChart';
import { FunnelTable } from './FunnelTable';
import { BreakdownTable } from './BreakdownTable';
import { BreakdownRow, FunnelRow } from './types';

const useStyles = makeStyles({
  card: { ...shorthands.padding('20px'), rowGap: '12px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 900px)': { gridTemplateColumns: '1fr 1fr' },
  },
});

type Props = {
  trend: { current: TrendPoint[]; prior: TrendPoint[] };
  funnel: FunnelRow[];
  deviceRows: BreakdownRow[];
  regionRows: BreakdownRow[];
};

export const EvidenceSection: React.FC<Props> = ({ trend, funnel, deviceRows, regionRows }) => {
  const s = useStyles();
  return (
    <section>
      <Text weight="semibold">หลักฐาน (Evidence)</Text>
      <div className={s.grid}>
        <TrendChart
          current={trend.current}
          prior={trend.prior}
          eventLines={[
            { x: 'Aug 4', label: 'เส้นฟ้า = เปิด OTP (4 ส.ค.)' },
            {
              x: 'Aug 5',
              color: '#F1A7A7',
              dash: '4 4',
              label: 'เส้นชมพู = payment timeout (5 ส.ค.)',
            },
          ]}
        />
        <FunnelTable rows={funnel} />
        <BreakdownTable
          title="Breakdown — Device"
          columns={['Segment', 'Conversions', 'CPA', 'Δ']}
          rows={deviceRows}
        />
        <BreakdownTable
          title="Breakdown — Region"
          columns={['Segment', 'Share', 'Δ']}
          rows={regionRows}
        />
      </div>
    </section>
  );
};

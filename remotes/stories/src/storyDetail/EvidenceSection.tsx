// remotes/stories/src/storyDetail/EvidenceSection.tsx
import * as React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { TrendChart, TrendPoint } from './TrendChart';
import { FunnelTable } from './FunnelTable';
import { BreakdownTable } from './BreakdownTable';
import { BreakdownRow, FunnelRow } from './types';
import { DataPie24Color, DataTrending24Color } from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: { ...shorthands.padding('20px'), rowGap: '12px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    '@media (min-width: 900px)': { gridTemplateColumns: '1fr 1fr' },
  },
  titleWrap: { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },

  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
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
      <div className={s.titleWrap}>
        <DataPie24Color />
        <Text className={s.title}>Evidence</Text>
      </div>

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

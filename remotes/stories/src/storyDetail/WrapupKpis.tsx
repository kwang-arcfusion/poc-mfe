// remotes/stories/src/storyDetail/WrapupKpis.tsx
import * as React from 'react';
import { makeStyles, Text, tokens } from '@fluentui/react-components';
import { KpiCard } from './KpiCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '14px',
    '@media (min-width: 760px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
  },
});

export const WrapupKpis: React.FC = () => {
  const s = useStyles();
  return (
    <>
      <Text weight="semibold">Wrapup KPIs</Text>
      <section className={s.grid} aria-label="ภาพรวมตัวเลข (Wrap-up KPIs)">
        <KpiCard
          label="7-Day Average"
          value={6.1}
          delta={{ direction: 'down', text: '−88% vs baseline' }}
          chips={['Now: 3–9 ส.ค.', 'Baseline: prior 7 days', 'Sig: p = 0.03']}
          definition={<>ค่าเฉลี่ยจำนวน Purchase/วัน ในช่วงล่าสุด 7 วัน เทียบ 7 วันก่อนหน้า</>}
          sparkColor={tokens.colorPaletteRedForeground2}
          sparkPoints={[0.8, 0.72, 0.6, 0.55, 0.5, 0.45, 0.44]}
          caption="ค่าเดิมเฉลี่ย 7 วันก่อนหน้า: 53.0"
        />
        <KpiCard
          label="Spend"
          value="฿118,400"
          delta={{ direction: 'down', text: '−2%' }}
          chips={['Currency: THB', 'Now vs prior']}
          sparkColor={tokens.colorNeutralForeground2}
          sparkPoints={[0.5, 0.48, 0.52, 0.49, 0.51, 0.5, 0.5]}
          caption="ควบคุมงบใกล้เคียงเดิม"
        />
        <KpiCard
          label="Revenue"
          value="฿258,000"
          delta={{ direction: 'down', text: '−88%' }}
          chips={['AOV: ฿6,000', 'Now vs prior']}
          sparkColor={tokens.colorPaletteRedForeground2}
          sparkPoints={[0.9, 0.75, 0.62, 0.58, 0.52, 0.5, 0.49]}
          caption="สอดคล้องกับจำนวน Purchase ที่ลดลง"
        />
        <KpiCard
          label="ROAS"
          value="2.18"
          delta={{ direction: 'down', text: '−88%' }}
          chips={['Target: ≥ 6.0', 'Now vs prior']}
          goalPct={36}
          goalCaption="ความคืบหน้าสู่เป้าหมาย (36% ของเป้า 6.0)"
        />
      </section>
    </>
  );
};

// remotes/stories/src/StoryDetailPage.tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Title1,
  Text,
  Card,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

import { WrapupKpis } from './storyDetail/WrapupKpis';
import { NarrativeCard } from './storyDetail/NarrativeCard';
import { ActionsCard } from './storyDetail/ActionsCard';
import { EvidenceSection } from './storyDetail/EvidenceSection';

// mock for evidence (สอดคล้องกับ narrative)
import {
  trendCurrent,
  trendPrior,
  funnelRows,
  breakdownDevice,
  breakdownRegion,
} from './storyDetail/mock';

/* =============================
   Styles (Fluent UI tokens only)
============================= */
const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '20px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '48px',
    backgroundColor: tokens.colorNeutralBackground2,
  },

  // crumbs + actions (Export/Share)
  crumbsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: '12px',
    rowGap: '8px',
    flexWrap: 'wrap',
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    columnGap: '8px',
  },

  // filter chips under crumbs
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '8px',
    rowGap: '8px',
  },

  // hero alert (สรุปหัวเรื่อง + delta + meta)
  hero: {
    position: 'relative',
    ...shorthands.padding('18px'),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundImage: `linear-gradient(180deg, ${tokens.colorNeutralBackground1}, ${tokens.colorNeutralBackground2})`,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),

    display: 'flex',
    flexDirection: 'column',
    rowGap: '8px',
  },
  heroTitleRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: '6px',
  },
  detailRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  deltaPill: {
    display: 'inline-flex',
    alignItems: 'center',
    columnGap: '8px',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.border('1px', 'solid', tokens.colorPaletteRedBorder2),
    ...shorthands.borderRadius('12px'),
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground2,
    fontWeight: tokens.fontWeightSemibold,
  },
  heroMeta: {
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '12px',
    rowGap: '6px',
    fontSize: tokens.fontSizeBase200,
  },

  // main two columns (Narrative | Actions)
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '20px',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr',
      columnGap: '20px',
    },
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    paddingBottom: '24px',
  },

  appendix: {
    ...shorthands.padding('16px'),
    display: 'flex',
    flexDirection: 'column',
    rowGap: '6px',
  },
});

export default function StoryDetailPage() {
  const s = useStyles();

  return (
    <div className={s.page}>
      {/* Hero / Alert */}
      <div>
        <div className={s.heroTitleRow}>
          <Title1 as="h1">Conversions ร่วงแรงที่ขั้นชำระเงิน</Title1>
          <div className={s.detailRow}>
            <span className={s.deltaPill}>▼ −88% vs prior 7 days</span>
            {/* Context chips */}
            <div className={s.chips} role="toolbar" aria-label="page context">
              <Badge appearance="outline">
                <strong>Facebook</strong>
              </Badge>
              <Badge appearance="outline">ช่วง: 3–9 ส.ค. 2025</Badge>
              <Badge appearance="outline">เทียบกับ: 27 ก.ค.–2 ส.ค. 2025</Badge>
              <Badge appearance="outline">Metric: Conversions</Badge>
              <Badge appearance="outline">ประเทศ: TH</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative + Recommended Actions */}
      <section className={s.mainGrid}>
        <NarrativeCard />
        <ActionsCard />
      </section>

      {/* Evidence (Trend + Funnel + Breakdown) */}
      <EvidenceSection
        trend={{ current: trendCurrent, prior: trendPrior }}
        funnel={funnelRows}
        deviceRows={breakdownDevice}
        regionRows={breakdownRegion}
      />

      {/* Wrap-up KPIs (4 ใบ) */}
      <WrapupKpis />
    </div>
  );
}

// remotes/stories/src/StoryDetailPage.tsx
import * as React from 'react';
import {
  Badge,
  Button,
  Title1,
  Text,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';
import { useLayoutStore } from '@arcfusion/store';
import { WrapupKpis } from './storyDetail/WrapupKpis';
import { NarrativeCard } from './storyDetail/NarrativeCard';
import { ActionsCard } from './storyDetail/ActionsCard';
import { EvidenceSection } from './storyDetail/EvidenceSection';
import {
  trendCurrent,
  trendPrior,
  funnelRows,
  breakdownDevice,
  breakdownRegion,
} from './storyDetail/mock';
// ✨ 1. Import local panel component
import { AskAiPanel } from './askAiPanel/AskAiPanel';

const useStyles = makeStyles({
  outer: {
    overflow: 'hidden',
    height: 'calc(100vh - 60px)',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  askAiButton: {
    position: 'fixed',
    top: '62px',
    right: '36px',
    zIndex: 10,
  },
  singleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    height: '100%',
  },
  splitGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    columnGap: '12px',
    height: '100%',
    paddingLeft: '12px',
    paddingRight: '12px',
    boxSizing: 'border-box',
  },
  leftPane: {
    height: '100%',
    overflow: 'auto', // ส่วนเนื้อหา scroll ได้
  },
  // ✨ 2. ปรับแก้ rightPane ให้ไม่ scroll เอง
  rightPane: {
    height: '100%',
    overflow: 'hidden', // Pane นี้ไม่ต้องมี scrollbar
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  page: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '20px',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingBottom: '48px',
    backgroundColor: tokens.colorNeutralBackground2,
    boxSizing: 'border-box',
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
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '8px',
    rowGap: '8px',
  },
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
});

export default function StoryDetailPage() {
  const s = useStyles();
  const { setMainOverflow } = useLayoutStore();
  const [aiOpen, setAiOpen] = React.useState(false);

  React.useEffect(() => {
    setMainOverflow('visible');
    return () => {
      setMainOverflow('auto');
    };
  }, [setMainOverflow]);

  return (
    <div className={s.outer}>
      {!aiOpen && (
        <Button
          className={s.askAiButton}
          icon={<Sparkle24Regular />}
          size="large"
          onClick={() => setAiOpen(true)}
        >
          Ask AI
        </Button>
      )}

      <div className={aiOpen ? s.splitGrid : s.singleGrid}>
        {/* LEFT (content) - ส่วนนี้เหมือนเดิม */}
        <section className={s.leftPane}>
          <div className={s.page}>
            <div className={s.heroTitleRow}>
              <Title1 as="h1">Conversions ร่วงแรงที่ขั้นชำระเงิน</Title1>
              <div className={s.detailRow}>
                <span className={s.deltaPill}>▼ −88% vs prior 7 days</span>
                <div className={s.chips} role="toolbar" aria-label="page context">
                  <Badge appearance="outline">
                    <strong>Facebook</strong>
                  </Badge>
                  <Badge appearance="outline">ช่วง: 3–9 ส.ค. 2025</Badge>
                  <Badge appearance="outline">เทียบกับ: 27 ก.ค.–2 ส.ค. 2025</Badge>
                </div>
              </div>
            </div>
            <section className={s.mainGrid}>
              <NarrativeCard />
              <ActionsCard />
            </section>
            <EvidenceSection
              trend={{ current: trendCurrent, prior: trendPrior }}
              funnel={funnelRows}
              deviceRows={breakdownDevice}
              regionRows={breakdownRegion}
            />
            <WrapupKpis />
          </div>
        </section>

        {/* ✨ 3. RIGHT (Chat AI) - แทนที่ส่วนเดิมทั้งหมดด้วย AskAiPanel */}
        {aiOpen && (
          <aside className={s.rightPane} aria-label="AI Chat Panel">
            <AskAiPanel onClose={() => setAiOpen(false)} />
          </aside>
        )}
      </div>
    </div>
  );
}

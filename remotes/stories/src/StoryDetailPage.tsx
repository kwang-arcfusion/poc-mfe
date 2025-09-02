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
import { Sparkle24Regular, TriangleDown16Filled } from '@fluentui/react-icons';
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
import { AskAiPanel } from './askAiPanel/AskAiPanel';

// ✨ 1. Import component for Resizable Panel
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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
  // ✨ 2. Adjust splitGrid to be a simple flex container
  splitGrid: {
    display: 'flex',
    height: '100%',
    paddingLeft: '12px',
    boxSizing: 'border-box',
  },
  leftPane: {
    height: '100%',
    overflow: 'auto', // The content can scroll
  },
  rightPane: {
    height: '100%',
    overflow: 'hidden',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
    // ✨ 3. Add minWidth to prevent the panel from getting too small
    minWidth: '320px',
  },
  // ✨ 4. Add Style for the Resize Handle
  resizeHandle: {
    width: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    outline: 'none',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    ':after': {
      content: '""',
      display: 'block',
      width: '2px',
      height: '32px',
      backgroundColor: tokens.colorNeutralStroke2,
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
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
    gap: '12px',
  },
  detailRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
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
    paddingBottom: '16px',
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

      {/* ✨ 5. Use PanelGroup instead of the original div */}
      <div className={aiOpen ? s.splitGrid : s.singleGrid}>
        {aiOpen ? (
          <PanelGroup direction="horizontal">
            {/* Left Panel (Main Content) */}
            <Panel defaultSize={70} minSize={40}>
              <section className={s.leftPane}>
                <div className={s.page}>
                  <div className={s.heroTitleRow}>
                    <Title1>Conversions plummeting at checkout</Title1>
                    <div className={s.detailRow}>
                      <Badge
                        icon={<TriangleDown16Filled />}
                        appearance="tint"
                        color="danger"
                        size="extra-large"
                      >
                        <Text size={400} weight="semibold">
                          −88% vs prior 7 days
                        </Text>
                      </Badge>
                      <div className={s.chips} role="toolbar" aria-label="page context">
                        <Badge appearance="tint">
                          <strong>Facebook</strong>
                        </Badge>
                        <Badge appearance="tint">Period: Aug 3–9, 2025</Badge>
                        <Badge appearance="tint">Compared to: Jul 27–Aug 2, 2025</Badge>
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
            </Panel>

            {/* Resize Handle */}
            <PanelResizeHandle className={s.resizeHandle} />

            {/* Right Panel (Ask AI) */}
            <Panel defaultSize={30} minSize={20}>
              <aside className={s.rightPane} aria-label="AI Chat Panel">
                <AskAiPanel onClose={() => setAiOpen(false)} />
              </aside>
            </Panel>
          </PanelGroup>
        ) : (
          // Original layout when AI Panel is closed
          <section className={s.leftPane}>
            <div className={s.page}>
              {/* ... (Same content as above) ... */}
              <div className={s.heroTitleRow}>
                <Title1>Conversions plummeting at checkout</Title1>
                <div className={s.detailRow}>
                  <Badge
                    icon={<TriangleDown16Filled />}
                    appearance="tint"
                    color="danger"
                    size="extra-large"
                  >
                    <Text size={400} weight="semibold">
                      −88% vs prior 7 days
                    </Text>
                  </Badge>
                  <div className={s.chips} role="toolbar" aria-label="page context">
                    <Badge appearance="tint">
                      <strong>Facebook</strong>
                    </Badge>
                    <Badge appearance="tint">Period: Aug 3–9, 2025</Badge>
                    <Badge appearance="tint">Compared to: Jul 27–Aug 2, 2025</Badge>
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
        )}
      </div>
    </div>
  );
}

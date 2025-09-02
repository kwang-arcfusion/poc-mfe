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
  Spinner,
} from '@fluentui/react-components';
import { Sparkle24Regular, TriangleDown16Filled } from '@fluentui/react-icons';
import { useLayoutStore } from '@arcfusion/store';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { getStoryById } from '@arcfusion/client';
import type { Story } from '@arcfusion/types';

// ✨ 1. นำ Components กลับเข้ามา
import { NarrativeCard } from './storyDetail/NarrativeCard';
import { ActionsCard } from './storyDetail/ActionsCard';
import { EvidenceSection } from './storyDetail/EvidenceSection';
import { WrapupKpis } from './storyDetail/WrapupKpis';
import { AskAiPanel } from './askAiPanel/AskAiPanel';

const useStyles = makeStyles({
  outer: {
    overflow: 'hidden',
    height: 'calc(100vh - 60px)',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  askAiButton: {
    position: 'fixed',
    top: '72px',
    right: '24px',
    zIndex: 10,
  },
  singleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    height: '100%',
  },
  splitGrid: {
    display: 'flex',
    height: '100%',
    paddingLeft: '12px',
    boxSizing: 'border-box',
  },
  leftPane: {
    height: '100%',
    overflow: 'auto',
  },
  rightPane: {
    height: '100%',
    overflow: 'hidden',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground1,
    minWidth: '320px',
  },
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
    paddingTop: '24px',
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
  centerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 60px)',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
});

interface StoryDetailPageProps {
  storyId?: string;
}

export default function StoryDetailPage({ storyId }: StoryDetailPageProps) {
  const s = useStyles();
  const { setMainOverflow } = useLayoutStore();

  const [story, setStory] = React.useState<Story | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [aiOpen, setAiOpen] = React.useState(false);

  React.useEffect(() => {
    setMainOverflow('hidden');
    return () => {
      setMainOverflow('auto');
    };
  }, [setMainOverflow]);

  React.useEffect(() => {
    if (!storyId) {
      setError('Story ID not found.');
      setIsLoading(false);
      return;
    }

    const fetchStory = async () => {
      try {
        setIsLoading(true);
        const storyData = await getStoryById(storyId);
        setStory(storyData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch story details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={s.centerContainer}>
          <Spinner size="huge" />
        </div>
      );
    }

    if (error || !story) {
      return (
        <div className={s.centerContainer}>
          <h3>{error || 'Story not found.'}</h3>
        </div>
      );
    }

    const topMover = story.top_movers && story.top_movers.length > 0 ? story.top_movers[0] : null;

    return (
      <section className={s.leftPane}>
        <div className={s.page}>
          <div className={s.heroTitleRow}>
            <Title1>{story.title}</Title1>
            <div className={s.detailRow}>
              {topMover && (
                <Badge
                  icon={topMover.direction === 'down' ? <TriangleDown16Filled /> : undefined}
                  appearance="tint"
                  color={topMover.direction === 'down' ? 'danger' : 'success'}
                  size="extra-large"
                >
                  <Text size={400} weight="semibold">
                    {topMover.change.toFixed(2)}% vs prior period
                  </Text>
                </Badge>
              )}
              <div className={s.chips} role="toolbar" aria-label="page context">
                <Badge appearance="tint">
                  <strong>{story.type.split('_')[0].toUpperCase()}</strong>
                </Badge>
                <Badge appearance="tint">
                  Period: {new Date(story.created_at).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
          <section className={s.mainGrid}>
            <NarrativeCard story={story} />
            <ActionsCard story={story} />
          </section>
          {/* ✨ 2. เพิ่ม Components กลับเข้ามา */}
          <EvidenceSection story={story} />
          <WrapupKpis story={story} />
        </div>
      </section>
    );
  };

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
        {aiOpen ? (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={70} minSize={40}>
              {renderContent()}
            </Panel>
            <PanelResizeHandle className={s.resizeHandle} />
            <Panel defaultSize={30} minSize={20}>
              <aside className={s.rightPane} aria-label="AI Chat Panel">
                <AskAiPanel onClose={() => setAiOpen(false)} />
              </aside>
            </Panel>
          </PanelGroup>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}

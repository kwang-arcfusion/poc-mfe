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
import {
  Sparkle24Regular,
  TriangleDown16Filled,
  ArrowDownload24Regular,
} from '@fluentui/react-icons';
import { useLayoutStore, ChatSessionProvider } from '@arcfusion/store';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { getStoryById, getStoryExportPdfUrl } from '@arcfusion/client';
import type { Story } from '@arcfusion/types';
import { NarrativeCard } from './storyDetail/NarrativeCard';
import { ActionsCard } from './storyDetail/ActionsCard';
import { EvidenceSection } from './storyDetail/EvidenceSection';
import { AskAiPanel } from './askAiPanel/AskAiPanel';
import { TechnicalDetails } from './storyDetail/TechnicalDetails';
// 1. เพิ่ม import ของคอมโพเนนต์ใหม่
import { MoversComparisonTable } from './storyDetail/MoversComparisonTable';

const useStyles = makeStyles({
  outer: {
    overflow: 'hidden',
    height: 'calc(100vh - 60px)',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  splitGrid: {
    display: 'flex',
    height: '100%',
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
    width: '100%',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '8px',
    rowGap: '8px',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    rowGap: '20px',
    '@media (min-width: 1024px)': {
      gridTemplateColumns: '1fr 1fr',
      columnGap: '20px',
    },
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusXLarge,
    boxShadow: tokens.shadow4,
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
  threadId?: string | null;
  navigate: (path: string, options?: { replace?: boolean }) => void;
}

export default function StoryDetailPage({ storyId, threadId, navigate }: StoryDetailPageProps) {
  const s = useStyles();
  const { setMainOverflow } = useLayoutStore();
  const [story, setStory] = React.useState<Story | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [aiOpen, setAiOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  React.useEffect(() => {
    setMainOverflow('hidden');
    return () => {
      setMainOverflow('auto');
    };
  }, [setMainOverflow]);

  React.useEffect(() => {
    if (threadId && !isLoading) {
      setAiOpen(true);
    }
  }, [threadId, isLoading]);

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

  const handleExportStoryPdf = async () => {
    if (!storyId || isExporting) {
      return;
    }

    setIsExporting(true);
    try {
      const url = getStoryExportPdfUrl(storyId);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch story PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `story-${storyId}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Export Story PDF failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

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
              <div className={s.chips} role="toolbar" aria-label="page context">
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                  <Badge appearance="tint">
                    <strong>{story.type.split('_')[0].toUpperCase()}</strong>
                  </Badge>
                  <Badge appearance="tint">
                    Period: {new Date(story.created_at).toLocaleDateString()}
                  </Badge>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button
                    appearance="secondary"
                    icon={isExporting ? <Spinner size="tiny" /> : <ArrowDownload24Regular />}
                    onClick={handleExportStoryPdf}
                    disabled={isExporting || isLoading}
                  >
                    {isExporting ? 'Exporting...' : 'Export to PDF'}
                  </Button>
                  {!aiOpen && (
                    <Button icon={<Sparkle24Regular />} onClick={() => setAiOpen(true)}>
                      Ask AI
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <section className={s.mainGrid}>
            <NarrativeCard story={story} />
            <ActionsCard story={story} />
          </section>
          {/* 2. เพิ่มคอมโพเนนต์ใหม่เข้ามาในหน้านี้ */}
          <EvidenceSection story={story} />
          <MoversComparisonTable story={story} />
          <TechnicalDetails story={story} />
        </div>
      </section>
    );
  };

  return (
    <div className={s.outer}>
      <div className={s.splitGrid}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={100} minSize={40}>
            {renderContent()}
          </Panel>

          {aiOpen && (
            <>
              <PanelResizeHandle className={s.resizeHandle} />
              <Panel defaultSize={30} minSize={20} collapsible>
                <aside className={s.rightPane} aria-label="AI Chat Panel">
                  <ChatSessionProvider>
                    <AskAiPanel
                      story={story!}
                      threadId={threadId || undefined}
                      onClose={() => setAiOpen(false)}
                      navigate={navigate}
                    />
                  </ChatSessionProvider>
                </aside>
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  );
}

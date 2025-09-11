// remotes/stories/src/components/InsightCard.tsx
import React, { useMemo } from 'react';
import { makeStyles, shorthands, tokens, Badge, Text } from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Story } from '@arcfusion/types';
import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@arcfusion/store';

const useStyles = makeStyles({
  insightCard: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow8,
    ...shorthands.padding('20px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    transition: '0.2s ease-in-out',
    cursor: 'pointer',
    ':hover': {
      boxShadow: tokens.shadow28,
      border: `1px solid ${tokens.colorBrandStroke1}`,
      transform: 'translateY(-4px)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexShrink: 0,
  },
  platformIconContainer: {
    height: '28px',
    width: '28px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    ...shorthands.gap('2px'),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.borderRadius(tokens.borderRadiusSmall),
    ...shorthands.padding('4px'),
    boxSizing: 'border-box',
  },
  iconBar: {
    width: '4px',
    ...shorthands.borderRadius('1px'),
  },
  timeAgo: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('12px'),
  },
  titleText: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.3,
    display: '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '40px',
    padding: '6px 0',
  },
  kpiBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...shorthands.gap('4px'),
  },
  kpiMetric: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  kpiValue: {
    fontSize: '36px',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
    marginBottom: '4px',
  },
  chartContainer: {
    width: '100%',
    height: '120px',
    flexShrink: 0,
  },
  summaryContainer: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalS),
    alignItems: 'flex-start',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    paddingTop: '12px',
  },
  summaryText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.5,
    '& p': { margin: 0 },
  },
  sparkleIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
    marginTop: '2px',
  },
});

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;
  return `${Math.floor(seconds)} seconds ago`;
};

interface InsightCardProps {
  story: Story;
  onClick: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ story, onClick }) => {
  const styles = useStyles();
  const { theme } = useThemeStore();
  const timeAgo = formatTimeAgo(story.created_at);
  const topMover = story.top_movers?.[0];

  const kpiValueColor =
    topMover?.direction === 'down'
      ? tokens.colorPaletteRedForeground1
      : tokens.colorPaletteGreenForeground1;

  const chartOptions = useMemo(() => {
    if (!story.echart_config) return null;
    const newConfig = JSON.parse(JSON.stringify(story.echart_config));
    return {
      ...newConfig,
      title: { ...newConfig.title, show: false },
      grid: { ...newConfig.grid, left: '12%', right: '4%', top: '15%', bottom: '10%' },
      xAxis: { ...newConfig.xAxis, show: false },
      yAxis: { ...newConfig.yAxis, axisLabel: { ...newConfig.yAxis?.axisLabel, fontSize: 10 } },
      legend: { ...newConfig.legend, show: false },
    };
  }, [story.echart_config]);

  return (
    <div className={styles.insightCard} onClick={onClick}>
      <header className={styles.cardHeader}>
        <Badge appearance="tint">
          <strong>{story.type.split('_')[0].toUpperCase()}</strong>
        </Badge>
        <Text className={styles.timeAgo}>{timeAgo}</Text>
      </header>

      <div className={styles.cardBody}>
        <Text className={styles.titleText}>{story.title}</Text>
        {topMover && (
          <div className={styles.kpiBlock}>
            <Badge
              appearance="tint"
              color={topMover.direction === 'down' ? 'danger' : 'success'}
              size="medium"
            >
              {topMover.direction === 'down' ? 'Significant Drop' : 'Significant Growth'}
            </Badge>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Text className={styles.kpiMetric}>{story.metric_label}</Text>

              <Text className={styles.kpiValue} style={{ color: kpiValueColor }}>
                {topMover.change.toFixed(2)}%
              </Text>
            </div>
          </div>
        )}
        {chartOptions && (
          <div className={styles.chartContainer}>
            <ReactECharts
              option={chartOptions}
              theme={theme}
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </div>
        )}
      </div>

      {story.narrative_markdown && (
        <footer className={styles.summaryContainer}>
          <Sparkle24Regular className={styles.sparkleIcon} />
          <div className={styles.summaryText}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {story.narrative_markdown.split('\n')[0]}
            </ReactMarkdown>
          </div>
        </footer>
      )}
    </div>
  );
};

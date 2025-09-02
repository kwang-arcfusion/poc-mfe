// remotes/stories/src/components/InsightCard.tsx
import React, { useMemo } from 'react'; // ✨ 1. Import useMemo
import { makeStyles, shorthands, tokens, Badge } from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Story } from '@arcfusion/types';
// ✨ 2. Import Recharts components
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const useStyles = makeStyles({
  insightCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow8,
    ...shorthands.padding('24px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    cursor: 'pointer',
    transition: '0.2s ease-in-out',
    ':hover': {
      boxShadow: tokens.shadow28,
      border: `1px solid ${tokens.colorBrandStroke1}`,
      transform: 'scale(1.02)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  platformIcon: {
    fontSize: '24px',
    fontWeight: tokens.fontWeightBold,
    color: '#1877F2',
  },
  timeAgo: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  titleText: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.4,
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '40px',
  },
  kpiContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  kpiLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...shorthands.gap(tokens.spacingVerticalXS),
  },
  kpiMetric: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    lineHeight: 1.2,
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: tokens.fontWeightBold,
    lineHeight: 1,
  },
  summaryContainer: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalS),
    alignItems: 'flex-start',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    paddingTop: '16px',
  },
  summaryText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.5,
    '& p': { margin: 0 },
    '& strong': { color: tokens.colorNeutralForeground1 },
    '& ul, & ol': {
      ...shorthands.margin(0),
      paddingLeft: tokens.spacingHorizontalL,
    },
  },
  sparkleIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
    marginTop: '2px',
  },
  // ✨ 3. เพิ่ม Style สำหรับ Container ของกราฟ
  chartContainer: {
    width: '100%',
    height: '60px', // กำหนดความสูงของกราฟ
    marginTop: tokens.spacingVerticalS,
  },
});

// Helper Functions
const formatTimeAgo = (dateString: string): string => {
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

const getPlatformIcon = (storyType: string): string => {
  if (storyType.toLowerCase().includes('facebook')) return 'f';
  if (storyType.toLowerCase().includes('google')) return 'G';
  if (storyType.toLowerCase().includes('tiktok')) return 't';
  return '📊';
};

// ✨ 4. สร้างฟังก์ชันสำหรับสร้างข้อมูลกราฟตัวอย่าง
const generateSparklineData = (direction: 'up' | 'down') => {
  const data = [];
  let value = 50; // Starting point
  const trend = direction === 'up' ? 5 : -5;

  for (let i = 0; i < 15; i++) {
    data.push({ value });
    const randomFactor = (Math.random() - 0.4) * 10; // Add some noise
    value += trend + randomFactor;
    if (value < 10) value = 10; // Keep it above a baseline
  }
  return data;
};

interface InsightCardProps {
  story: Story;
  onClick: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ story, onClick }) => {
  const styles = useStyles();
  const timeAgo = formatTimeAgo(story.created_at);
  const platformIcon = getPlatformIcon(story.type);
  const topMover = story.top_movers && story.top_movers.length > 0 ? story.top_movers[0] : null;

  const kpiValue = topMover ? `${topMover.change.toFixed(2)}%` : 'N/A';
  const kpiValueColor = topMover
    ? topMover.direction === 'down'
      ? tokens.colorPaletteRedForeground1
      : tokens.colorPaletteGreenForeground1
    : tokens.colorNeutralForeground2;

  // ✨ 5. สร้างข้อมูลกราฟด้วย useMemo เพื่อไม่ให้ re-render ทุกครั้งโดยไม่จำเป็น
  const chartData = useMemo(() => {
    return generateSparklineData(topMover?.direction || 'down');
  }, [topMover?.direction]);

  return (
    <div className={styles.insightCard} onClick={onClick}>
      <div className={styles.cardHeader}>
        <div className={styles.platformIcon}>{platformIcon}</div>
        <span className={styles.timeAgo}>{timeAgo}</span>
      </div>
      <div className={styles.titleText}>{story.title}</div>
      <div className={styles.kpiContainer}>
        <div className={styles.kpiLeft}>
          {topMover && (
            <Badge
              appearance="tint"
              color={topMover.direction === 'down' ? 'danger' : 'success'}
              size="large"
            >
              {topMover.direction === 'down' ? 'Significant Drop' : 'Significant Growth'}
            </Badge>
          )}
          <div className={styles.kpiMetric}>{story.metric_label}</div>
        </div>
        <div className={styles.kpiValue} style={{ color: kpiValueColor }}>
          {kpiValue}
        </div>
      </div>

      {/* ✨ 6. เพิ่มส่วนแสดงผลกราฟ */}
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={kpiValueColor}
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {story.narrative_markdown && (
        <div className={styles.summaryContainer}>
          <Sparkle24Regular className={styles.sparkleIcon} />
          <div className={styles.summaryText}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {story.narrative_markdown.split('\n')[0]}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

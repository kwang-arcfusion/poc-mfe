// remotes/stories/src/components/InsightCard.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Badge } from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';
// ✨ 1. Import ReactMarkdown เพื่อแสดงผล Markdown ได้อย่างปลอดภัย
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// ✨ 2. Import Story type จาก @arcfusion/types
import type { Story } from '@arcfusion/types';

const useStyles = makeStyles({
  insightCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow8,
    ...shorthands.padding('24px'),
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    transitionProperty: 'box-shadow, transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-in-out',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    cursor: 'pointer',
    transition: '0.25s ease',
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
  // ✨ 3. เพิ่ม Style สำหรับ Platform Icon ที่จะสร้างขึ้นมาใหม่
  platformIcon: {
    fontSize: '24px',
    fontWeight: tokens.fontWeightBold,
    color: '#1877F2', // Default color, can be changed based on logic
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
    // ✨ 4. เพิ่ม Style เพื่อจัดการข้อความยาว
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    minHeight: '40px', // Reserve space for 2 lines
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
    color: tokens.colorPaletteRedForeground1, // Default to red
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
    // ✨ 5. เพิ่ม Style สำหรับ Markdown เพื่อให้แสดงผลสวยงาม
    '& p': {
      margin: 0,
    },
    '& strong': {
      color: tokens.colorNeutralForeground1,
    },
  },
  sparkleIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
    marginTop: '2px',
  },
});

// ✨ 6. สร้าง Helper Functions เพื่อแปลงข้อมูล
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
  return '📊'; // Default icon
};

interface InsightCardProps {
  story: Story;
  onClick: () => void;
}

export const InsightCard: React.FC<InsightCardProps> = ({ story, onClick }) => {
  const styles = useStyles();

  // ✨ 7. ดึงและแปลงข้อมูลจาก Prop `story` เพื่อนำไปใช้งาน
  const timeAgo = formatTimeAgo(story.created_at);
  const platformIcon = getPlatformIcon(story.type);
  const topMover = story.top_movers && story.top_movers.length > 0 ? story.top_movers[0] : null;

  const kpiValue = topMover ? `${topMover.change.toFixed(2)}%` : 'N/A';
  const kpiValueColor = topMover
    ? topMover.direction === 'down'
      ? tokens.colorPaletteRedForeground1
      : tokens.colorPaletteGreenForeground1
    : tokens.colorNeutralForeground2;

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

      {story.narrative_markdown && (
        <div className={styles.summaryContainer}>
          <Sparkle24Regular className={styles.sparkleIcon} />
          <div className={styles.summaryText}>
            {/* ✨ 8. ใช้ ReactMarkdown แทน dangerouslySetInnerHTML */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {story.narrative_markdown.split('\n')[0]}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

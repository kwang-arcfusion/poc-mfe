// remotes/stories/src/components/InsightCard.tsx
import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { Story } from '../types';

// --- Component Styles ---
// Using Fluent UI's makeStyles for consistent styling
const useStyles = makeStyles({
  insightCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow8,
    ...shorthands.padding('24px'),
    width: '100%',
    maxWidth: '400px',
    minWidth: '320px', // Ensure card doesn't get too small
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    transitionProperty: 'box-shadow, transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-in-out',
    boxSizing: 'border-box',
    flex: '1 1 320px', // Flex properties for wrapping grid
    ':hover': {
      boxShadow: tokens.shadow16,
      transform: 'translateY(-2px)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  platformIcon: {
    fontSize: '24px',
    fontWeight: tokens.fontWeightBold,
    color: '#1877F2', // Facebook Blue
  },
  timeAgo: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  cardBody: {},
  kpiMain: {
    display: 'flex',
    alignItems: 'flex-start',
    ...shorthands.gap('16px'),
    marginBottom: '8px',
  },
  kpiValue: {
    fontSize: '48px',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorPaletteRedForeground1, // Negative Red
    lineHeight: 1,
  },
  kpiDetails: {
    paddingTop: '4px',
  },
  kpiTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    margin: 0,
  },
  kpiSubtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    margin: '4px 0 0 0',
  },
  statusTag: {
    display: 'inline-block',
    backgroundColor: '#fcf0e4',
    color: '#af6418',
    ...shorthands.padding('4px', '10px'),
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightMedium,
    marginTop: '8px',
  },
  chartContainer: {
    width: '100%',
    marginTop: '20px',
  },
  summaryText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground2,
    lineHeight: 1.5,
    marginTop: '16px',
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    paddingTop: '16px',
  },
});

interface InsightCardProps {
  story: Story;
}

// --- InsightCard Component ---
// This component renders a single story card with the improved design.
export const InsightCard: React.FC<InsightCardProps> = ({ story }) => {
  const styles = useStyles();

  return (
    <div className={styles.insightCard}>
      <div className={styles.cardHeader}>
        {/* Platform icon (e.g., 'f' for Facebook) */}
        <div className={styles.platformIcon}>{story.platform.icon}</div>
        <span className={styles.timeAgo}>{story.timeAgo}</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.kpiMain}>
          <div className={styles.kpiValue}>{story.kpi.value}</div>
          <div className={styles.kpiDetails}>
            <h2 className={styles.kpiTitle}>{story.kpi.title}</h2>
            <p className={styles.kpiSubtitle}>{story.kpi.subtitle}</p>
            {story.kpi.tag && <div className={styles.statusTag}>{story.kpi.tag}</div>}
          </div>
        </div>

        <div className={styles.chartContainer}>
          {/* SVG chart for data visualization */}
          <svg viewBox="0 0 100 40" preserveAspectRatio="none">
            <path
              d="M 0,15 C 10,5 20,25 35,22 L 50,20 L 60,35 L 75,37 L 85,34 L 100,32"
              stroke="#6C63FF"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="50"
              y1="20"
              x2="60"
              y2="35"
              stroke={tokens.colorPaletteRedBorderActive}
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="60"
              y1="10"
              x2="60"
              y2="35"
              stroke={tokens.colorNeutralStroke2}
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <circle cx="50" cy="20" r="1.5" fill="#6C63FF" />
            <circle cx="60" cy="35" r="1.5" fill={tokens.colorPaletteRedBorderActive} />
            <text x="62" y="10" fontSize="4" fill={tokens.colorNeutralForeground2}>
              {story.chartHighlightLabel}
            </text>
          </svg>
        </div>

        <div className={styles.summaryText}>
          {/* Use dangerouslySetInnerHTML to render bold tags from data */}
          <span dangerouslySetInnerHTML={{ __html: story.summary }} />
        </div>
      </div>
    </div>
  );
};

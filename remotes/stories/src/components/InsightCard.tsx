// remotes/stories/src/components/InsightCard.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Badge } from '@fluentui/react-components';
import { Sparkle24Regular } from '@fluentui/react-icons';
import { Story } from '../types';

// --- Component Styles ---
const useStyles = makeStyles({
  // --- Main Card Styles ---
  insightCard: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    boxShadow: tokens.shadow8,
    ...shorthands.padding('24px'),
    width: '100%',
    maxWidth: '400px',
    minWidth: '320px',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    transitionProperty: 'box-shadow, transform',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-in-out',
    boxSizing: 'border-box',
    flex: '1 1 320px',
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    ':hover': {
      boxShadow: tokens.shadow16,
      transform: 'translateY(-2px)',
    },
  },

  // --- Block 1: Header ---
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

  // --- Block 2: Title (Subtitle from data) ---
  titleText: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    lineHeight: 1.4,
  },

  // --- Block 3: KPI & Badge ---
  kpiContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Align bottom so Badge and Value align nicely
  },
  kpiLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...shorthands.gap(tokens.spacingVerticalXS), // Spacing between Badge and KPI title
  },
  kpiMetric: {
    // Style for "Conversion Rate" in blue
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1, // Use primary brand color (blue)
    lineHeight: 1.2,
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorPaletteRedForeground1,
    lineHeight: 1,
  },

  // --- Block 4: Graph ---
  chartContainer: {
    width: '100%',
    height: '80px',
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
  },
  yAxis: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    ...shorthands.padding(0, tokens.spacingHorizontalM, 0, 0),
    ...shorthands.borderRight('1px', 'solid', tokens.colorNeutralStroke2),
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  graphArea: {
    flexGrow: 1,
    position: 'relative',
  },

  // --- Block 5: Summary ---
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
  },
  sparkleIcon: {
    color: tokens.colorBrandForeground1,
    flexShrink: 0,
    marginTop: '2px',
  },
});

interface InsightCardProps {
  story: Story;
}

export const InsightCard: React.FC<InsightCardProps> = ({ story }) => {
  const styles = useStyles();

  return (
    <div className={styles.insightCard}>
      {/* --- Block 1: Header --- */}
      <div className={styles.cardHeader}>
        <div className={styles.platformIcon}>{story.platform.icon}</div>
        <span className={styles.timeAgo}>{story.timeAgo}</span>
      </div>

      {/* --- Block 2: Title (using subtitle from data) --- */}
      <div className={styles.titleText}>{story.kpi.title}</div>

      {/* --- Block 3: KPI & Badge (Updated Layout) --- */}
      <div className={styles.kpiContainer}>
        <div className={styles.kpiLeft}>
          {story.kpi.tag && (
            <Badge appearance="tint" color="danger" size="large">
              {story.kpi.tag}
            </Badge>
          )}
          <div className={styles.kpiMetric}>{story.kpi.metric}</div>
        </div>
        <div className={styles.kpiValue}>{story.kpi.value}</div>
      </div>

      {/* --- Block 4: Graph --- */}
      <div className={styles.chartContainer}>
        <div className={styles.yAxis}>
          <span>1.5%</span>
          <span>0%</span>
        </div>
        <div className={styles.graphArea}>
          <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path
              d="M 0,25 C 10,15 25,10 40,20 L 60,35 L 75,30 L 100,28"
              stroke={tokens.colorBrandStroke1}
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 40,20 L 60,35"
              stroke={tokens.colorPaletteRedBorderActive}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="40" cy="20" r="1.5" fill={tokens.colorBrandStroke1} />
            <circle cx="60" cy="35" r="1.5" fill={tokens.colorPaletteRedBorderActive} />
            <text
              x="38"
              y="40"
              fontSize="5"
              textAnchor="middle"
              fill={tokens.colorNeutralForeground3}
            >
              Aug 7
            </text>
            <text
              x="60"
              y="40"
              fontSize="5"
              textAnchor="middle"
              fill={tokens.colorNeutralForeground3}
            >
              {story.chartHighlightLabel}
            </text>
          </svg>
        </div>
      </div>

      {/* --- Block 5: Summary --- */}
      <div className={styles.summaryContainer}>
        <Sparkle24Regular className={styles.sparkleIcon} />
        <div className={styles.summaryText}>
          <span dangerouslySetInnerHTML={{ __html: story.summary }} />
        </div>
      </div>
    </div>
  );
};

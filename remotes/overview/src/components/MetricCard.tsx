// remotes/overview/src/components/MetricCard.tsx
import React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ArrowTrending24Regular, ArrowTrendingDown24Regular } from '@fluentui/react-icons';
import { CardData } from '../types';

const useStyles = makeStyles({
  card: {
    width: '100%',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingVerticalS),
    height: '120px', // Set a fixed height for alignment
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: tokens.colorNeutralForeground2,
  },
  value: {
    fontSize: '2.5rem',
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: 1.2, // Adjust line height
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
  positive: { color: tokens.colorPaletteGreenForeground3 },
  negative: { color: tokens.colorPaletteRedForeground3 },
});

// Helper to format the main value based on API format config
const formatValue = (value: number, format: { type: string }) => {
  if (format.type === 'percent') {
    return `${value.toFixed(1)}%`;
  }
  if (format.type === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
  // Default number formatting
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

export const MetricCard: React.FC<{ card: CardData }> = ({ card }) => {
  const styles = useStyles();
  // delta_pct is a decimal (e.g., 0.27), so multiply by 100 for display
  const changePercent = card.delta_pct * 100;
  const isPositive = changePercent >= 0;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text>{card.label}</Text>
      </div>
      <div>
        <Text as="p" className={styles.value}>
          {formatValue(card.value, card.format)}
        </Text>
        <div className={`${styles.footer} ${isPositive ? styles.positive : styles.negative}`}>
          {isPositive ? <ArrowTrending24Regular /> : <ArrowTrendingDown24Regular />}
          <Text weight="semibold">{changePercent.toFixed(1)}%</Text>
        </div>
      </div>
    </Card>
  );
};
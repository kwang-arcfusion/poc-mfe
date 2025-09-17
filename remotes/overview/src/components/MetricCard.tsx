// remotes/overview/src/components/MetricCard.tsx
import React from 'react';
import {
  Card,
  Text,
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
} from '@fluentui/react-components';
import { ArrowTrending24Regular, ArrowTrendingDown24Regular } from '@fluentui/react-icons';
import { CardData } from '../types';

const useStyles = makeStyles({
  card: {
    minWidth: '140px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingVerticalS),
    height: '100px',
    cursor: 'pointer',
    ...shorthands.border('2px', 'solid', 'transparent'),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalL),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      ...shorthands.borderColor(tokens.colorNeutralStroke1Hover),
    },
  },
  selected: {
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    boxShadow: tokens.shadow8,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: tokens.colorNeutralForeground2,
  },
  value: {
    fontSize: '1.75rem',
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: 1.1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
  positive: { color: tokens.colorPaletteGreenForeground3 },
  negative: { color: tokens.colorPaletteRedForeground3 },
});

const formatValue = (value: number, format: { type: string }) => {
  if (format.type === 'percent') return `${value.toFixed(1)}%`;
  if (format.type === 'currency')
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  if (format.type === 'number') return value.toFixed(2);
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

interface MetricCardProps {
  card: CardData;
  onClick: (metricKey: string) => void;
  isSelected?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ card, onClick, isSelected }) => {
  const styles = useStyles();
  const changePercent = (card.delta_pct || 0) * 100;
  const isPositive = changePercent >= 0;

  return (
    <Card
      className={mergeClasses(styles.card, isSelected && styles.selected)}
      onClick={() => onClick(card.key)}
    >
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

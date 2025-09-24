// remotes/overview/src/components/MetricCard.tsx
import React from 'react';
import {
  Card,
  Text,
  makeStyles,
  shorthands,
  tokens,
  mergeClasses,
  Badge,
} from '@fluentui/react-components';
import { ArrowTrending24Regular, ArrowTrendingDown24Regular } from '@fluentui/react-icons';
import { CardData } from '../types';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    cursor: 'pointer',
    ...shorthands.border('2px', 'solid', 'transparent'),
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalL),
    ...shorthands.borderColor(tokens.colorNeutralStroke2),
    borderRadius: tokens.borderRadiusMedium,
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
    fontSize: '1.25rem',
    fontWeight: tokens.fontWeightSemibold,
    lineHeight: 1.1,
  },
  valuePositive: {
    color: tokens.colorPaletteGreenForeground2,
  },
  valueNegative: {
    color: tokens.colorPaletteRedForeground2,
  },
  valueWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
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
    <div
      className={mergeClasses(styles.card, isSelected && styles.selected)}
      onClick={() => onClick(card.key)}
    >
      <div className={styles.valueWrapper}>
        <div className={styles.header}>
          <Text style={{ color: tokens.colorBrandForeground2Hover }}>{card.label}</Text>
        </div>
        <div style={{ minWidth: '110px' }}>
          <Text
            as="p"
            className={mergeClasses(
              styles.value,
              isPositive ? styles.valuePositive : styles.valueNegative // ✨ เรียกใช้ style ตามเงื่อนไข
            )}
          >
            {formatValue(card.value, card.format)}
          </Text>
        </div>
      </div>
      <Badge
        className={styles.footer}
        size="extra-large"
        appearance="tint"
        color={isPositive ? 'success' : 'danger'}
        icon={isPositive ? <ArrowTrending24Regular /> : <ArrowTrendingDown24Regular />}
      >
        <Text weight="semibold">{changePercent.toFixed(1)}%</Text>
      </Badge>
    </div>
  );
};

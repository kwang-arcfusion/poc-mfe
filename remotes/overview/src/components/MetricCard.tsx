import React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ArrowTrending24Regular, ArrowTrendingDown24Regular } from '@fluentui/react-icons';
import { Metric } from '../types';

const useStyles = makeStyles({
  card: {
    width: '100%',
    minWidth: '200px',
    height: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    lineHeight: 1,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
  positive: { color: tokens.colorPaletteGreenForeground3 },
  negative: { color: tokens.colorPaletteRedForeground3 },
});

// Function ช่วย format ตัวเลข
const formatValue = (value: number, isCurrency = false) => {
  const prefix = isCurrency ? '$' : '';
  if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${prefix}${(value / 1000).toFixed(1)}K`;
  return `${prefix}${value.toLocaleString()}`;
};

export const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const styles = useStyles();
  const isPositive = metric.change >= 0;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text size={400}>{metric.title}</Text>
      </div>
      <Text as="p" className={styles.value}>
        {formatValue(metric.value, metric.isCurrency)}
      </Text>
      <div className={`${styles.footer} ${isPositive ? styles.positive : styles.negative}`}>
        {isPositive ? <ArrowTrending24Regular /> : <ArrowTrendingDown24Regular />}
        <Text size={300} weight="semibold">
          {metric.change.toFixed(1)}%
        </Text>
      </div>
    </Card>
  );
};

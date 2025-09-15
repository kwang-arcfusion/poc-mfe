// remotes/overview/src/components/OverallPerformance.tsx
import React from 'react';
import { makeStyles, shorthands, Text, tokens } from '@fluentui/react-components';
import { CardData } from '../types';
import { MetricCard } from './MetricCard';

const useStyles = makeStyles({
  grid: {
    display: 'flex',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    ...shorthands.gap('16px'),
    marginTop: '12px',
    paddingBottom: '16px',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: tokens.colorNeutralStroke2,
      ...shorthands.borderRadius(tokens.borderRadiusMedium),
    },
  },
});

interface OverallPerformanceProps {
  cards: CardData[];
  onCardClick: (metricKey: string) => void;
  selectedMetricKey: string;
}

export const OverallPerformance: React.FC<OverallPerformanceProps> = ({
  cards,
  onCardClick,
  selectedMetricKey,
}) => {
  const styles = useStyles();

  return (
    <section>
      <Text size={500} weight="semibold">
        Metrics
      </Text>
      <div className={styles.grid}>
        {cards.map((card) => (
          <MetricCard
            key={card.key}
            card={card}
            onClick={onCardClick}
            isSelected={card.key === selectedMetricKey}
          />
        ))}
      </div>
    </section>
  );
};
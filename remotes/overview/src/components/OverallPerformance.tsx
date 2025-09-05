import React from 'react';
import { makeStyles, shorthands } from '@fluentui/react-components';
import { CardData } from '../types';
import { MetricCard } from './MetricCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    ...shorthands.gap('16px'),
    gridTemplateColumns: `repeat(auto-fill, minmax(220px, 1fr))`,
  },
});

export const OverallPerformance: React.FC<{ cards: CardData[] }> = ({ cards }) => {
  const styles = useStyles();

  return (
    <section>
      <div className={styles.grid}>
        {cards.map((card) => (
          <MetricCard key={card.key} card={card} />
        ))}
      </div>
    </section>
  );
};
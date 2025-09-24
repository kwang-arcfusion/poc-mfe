// remotes/overview/src/components/OverallPerformance.tsx
import React from 'react';
import { makeStyles, shorthands, Text, tokens } from '@fluentui/react-components';
import { CardData } from '../types';
import { MetricCard } from './MetricCard';

const useStyles = makeStyles({
  grid: {
    display: 'grid', // 👈 เปลี่ยนจาก flex เป็น grid
    gridTemplateColumns: 'repeat(3, 1fr)', // 👈 กำหนดให้มี 3 คอลัมน์ขนาดเท่ากัน
    ...shorthands.gap('12px'), // 👈 เพิ่ม gap ให้สวยงามขึ้นเล็กน้อย
    marginTop: '12px',
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
  );
};

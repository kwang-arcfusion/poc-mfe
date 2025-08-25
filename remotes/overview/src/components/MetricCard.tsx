// remotes/overview/src/components/MetricCard.tsx
import React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ArrowTrending24Regular, ArrowTrendingDown24Regular } from '@fluentui/react-icons';
import { Metric } from '../types';

// --- ⬇️ [1] เปลี่ยน import จาก react-sparklines เป็น recharts ⬇️ ---
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const useStyles = makeStyles({
  card: {
    width: '100%',
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    ...shorthands.gap(tokens.spacingVerticalS),
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
    lineHeight: 0,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
  positive: { color: tokens.colorPaletteGreenForeground3 },
  negative: { color: tokens.colorPaletteRedForeground3 },
  sparklineContainer: {
    width: '100%',
    height: '30px',
  },
});

const formatValue = (value: number, isCurrency = false) => {
  const prefix = isCurrency ? '$' : '';
  if (value >= 1000000) return `${prefix}${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${prefix}${(value / 1000).toFixed(1)}K`;
  return `${prefix}${value.toLocaleString()}`;
};

export const MetricCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const styles = useStyles();
  const isPositive = metric.change >= 0;

  // --- ⬇️ [2] แปลงข้อมูลให้อยู่ในรูปแบบที่ recharts ต้องการ ⬇️ ---
  const rechartsData = metric.sparklineData?.map((val) => ({ value: val }));

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text>{metric.title}</Text>
      </div>
      <Text as="p" className={styles.value}>
        {formatValue(metric.value, metric.isCurrency)}
      </Text>
      <div className={`${styles.footer} ${isPositive ? styles.positive : styles.negative}`}>
        {isPositive ? <ArrowTrending24Regular /> : <ArrowTrendingDown24Regular />}
        <Text weight="semibold">{metric.change.toFixed(1)}%</Text>
      </div>

      {/* --- ⬇️ [3] เปลี่ยนมาใช้ Component จาก recharts ⬇️ --- */}
      {rechartsData && rechartsData.length > 0 && (
        <div className={styles.sparklineContainer}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rechartsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={
                  isPositive
                    ? tokens.colorPaletteGreenForeground3
                    : tokens.colorPaletteRedForeground3
                }
                strokeWidth={2}
                dot={false} // ไม่แสดงจุดบนกราฟ
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

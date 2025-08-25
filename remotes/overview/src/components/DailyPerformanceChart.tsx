import React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DailyDataPoint } from '../types';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding('24px'),
    height: '400px',
  },
});

// Function ช่วย format วันที่สำหรับแกน X
const formatXAxis = (tickItem: string) => {
  const date = new Date(tickItem);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const DailyPerformanceChart: React.FC<{ data: DailyDataPoint[] }> = ({ data }) => {
  const styles = useStyles();
  return (
    <section>
      <Text as="h2" size={600} weight="semibold">
        Daily Performance
      </Text>
      <Card className={styles.card}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke={tokens.colorNeutralForeground2}
            />
            <YAxis stroke={tokens.colorNeutralForeground2} />
            <Tooltip
              contentStyle={{
                backgroundColor: tokens.colorNeutralBackground1,
                border: `1px solid ${tokens.colorNeutralStroke2}`,
                borderRadius: tokens.borderRadiusMedium,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={tokens.colorBrandStroke1}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </section>
  );
};

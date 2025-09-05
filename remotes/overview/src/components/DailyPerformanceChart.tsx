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
  Legend,
} from 'recharts';
import { SeriesData } from '../types';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding('24px'),
    height: '400px',
    marginTop: '12px',
  },
});

const LINE_COLORS = [
  tokens.colorBrandStroke1,
  tokens.colorPaletteGreenForeground3,
  tokens.colorPaletteRedForeground3,
  tokens.colorPaletteBlueForeground2,
  tokens.colorPalettePurpleForeground2,
];

const formatXAxis = (tickItem: string) => {
  const date = new Date(tickItem);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: tokens.colorNeutralBackground1,
          border: `1px solid ${tokens.colorNeutralStroke2}`,
          borderRadius: tokens.borderRadiusMedium,
          padding: tokens.spacingHorizontalM,
          boxShadow: tokens.shadow8,
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{formatXAxis(label)}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ margin: '4px 0 0', color: pld.color }}>
            {`${pld.name}: ${pld.value.toFixed(1)}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DailyPerformanceChart: React.FC<{ data: SeriesData }> = ({ data }) => {
  const styles = useStyles();

  const processedData = data.series[0].points.map((point, index) => {
    const dataPoint: { [key: string]: string | number } = { date: point.date };
    data.series.forEach((s) => {
      dataPoint[s.label] = s.points[index]?.y || 0;
    });
    return dataPoint;
  });

  return (
    <section>
      <Text as="h2" size={600} weight="semibold">
        Daily Performance
      </Text>
      <Card className={styles.card}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={tokens.colorNeutralStroke2} />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxis}
              stroke={tokens.colorNeutralForeground2}
              tickMargin={10}
            />
            <YAxis
              stroke={tokens.colorNeutralForeground2}
              tickFormatter={(value) => `${value}%`}
              tickMargin={5}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {data.series.map((s, index) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.label}
                stroke={LINE_COLORS[index % LINE_COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </section>
  );
};
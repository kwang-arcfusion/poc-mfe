// remotes/stories/src/storyDetail/TrendChart.tsx
import * as React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Legend,
  Tooltip as RTooltip,
  ReferenceLine,
} from 'recharts';

const useStyles = makeStyles({
  card: { ...shorthands.padding('16px'), rowGap: '8px' },
  chart: { height: '260px' },
  note: { color: tokens.colorNeutralForeground3, fontSize: tokens.fontSizeBase200 },
});

export type TrendPoint = { day: string; value: number };
type Props = {
  current: TrendPoint[];
  prior: TrendPoint[];
  eventLines?: { x: string; color?: string; dash?: string; label?: string }[];
};

export const TrendChart: React.FC<Props> = ({ current, prior, eventLines = [] }) => {
  const s = useStyles();
  return (
    <Card appearance="filled" className={s.card}>
      <Text weight="semibold">Trend — Compared to Prior Period</Text>
      <div className={s.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={current}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Legend />
            <RTooltip />
            <Line
              data={prior}
              type="monotone"
              dataKey="value"
              name="Prior 7 days"
              stroke={tokens.colorPalettePurpleBorderActive}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Current"
              stroke={tokens.colorPaletteRedBorderActive}
              strokeWidth={3}
              dot={false}
            />
            {eventLines.map((e) => (
              <ReferenceLine
                key={e.x}
                x={e.x}
                stroke={e.color ?? tokens.colorNeutralStroke2}
                strokeDasharray={e.dash ?? '3 3'}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {eventLines.length > 0 && (
        <Text className={s.note}>
          Note:{' '}
          {eventLines
            .map((e) => e.label)
            .filter(Boolean)
            .join(' • ')}
        </Text>
      )}
    </Card>
  );
};

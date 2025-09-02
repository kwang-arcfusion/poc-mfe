// remotes/stories/src/storyDetail/EChartRenderer.tsx
import * as React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ChartMultiple24Color } from '@fluentui/react-icons';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding('20px'),
    rowGap: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  titleWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
  },
  title: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    fontSize: '18px',
  },
  jsonBox: {
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
    backgroundColor: tokens.colorNeutralBackground1,
    fontFamily: 'monospace',
    fontSize: '12px',
    maxHeight: '400px',
    overflow: 'auto',
    whiteSpace: 'pre',
  },
});

interface EChartRendererProps {
  config: Record<string, any> | null;
}

export const EChartRenderer: React.FC<EChartRendererProps> = ({ config }) => {
  const s = useStyles();

  if (!config) {
    return null;
  }

  return (
    <Card className={s.card}>
      <div className={s.titleWrap}>
        <ChartMultiple24Color />
        <Text className={s.title}>Chart Configuration (ECharts)</Text>
      </div>
      <Text>
        The backend has provided a complete chart configuration. A dedicated ECharts rendering component is needed to display this visually.
      </Text>
      <pre className={s.jsonBox}>
        {JSON.stringify(config, null, 2)}
      </pre>
    </Card>
  );
};
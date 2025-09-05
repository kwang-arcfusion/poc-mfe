import * as React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ChartMultiple24Color } from '@fluentui/react-icons';

import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@arcfusion/store';

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
});

interface EChartRendererProps {
  config: Record<string, any> | null;
}

export const EChartRenderer: React.FC<EChartRendererProps> = ({ config }) => {
  const s = useStyles();
  const { theme } = useThemeStore();

  if (!config) {
    return null;
  }

  return (
    <Card className={s.card}>
      <div className={s.titleWrap}>
        <ChartMultiple24Color />
        <Text className={s.title}>{config?.title?.text || 'Chart'}</Text>
      </div>
      <ReactECharts
        option={config}
        theme={theme}
        style={{ height: '400px', width: '100%' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </Card>
  );
};

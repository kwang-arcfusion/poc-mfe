// remotes/stories/src/storyDetail/EChartRenderer.tsx
import * as React from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import { ChartMultiple24Color, DataPie24Color } from '@fluentui/react-icons';

// ✨ 1. Import ECharts component และ Theme store
import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@arcfusion/store';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding('20px'),
    rowGap: '12px',
    borderRadius: tokens.borderRadiusLarge,
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
  // ✨ 2. ดึง theme ปัจจุบันมาจาก store
  const { theme } = useThemeStore();

  if (!config) {
    return null;
  }

  return (
    <Card className={s.card}>
      <div className={s.titleWrap}>
        <DataPie24Color />
        <Text className={s.title}>{config?.title?.text || 'Chart'}</Text>
      </div>
      {/* ✨ 3. ใช้ ReactECharts component ในการ render กราฟ */}
      <ReactECharts
        option={config}
        theme={theme} // ส่ง theme ปัจจุบัน (light/dark) ให้กับกราฟ
        style={{ height: '400px', width: '100%' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </Card>
  );
};

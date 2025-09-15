// remotes/overview/src/components/DailyPerformanceChart.tsx
import React, { useMemo } from 'react';
import { Card, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components';
import ReactECharts from 'echarts-for-react';
import { useThemeStore } from '@arcfusion/store';
import { SeriesData } from '../types';

const useStyles = makeStyles({
  card: {
    ...shorthands.padding('24px', '24px', '12px', '24px'),
    height: '400px',
    marginTop: '12px',
  },
});

interface DailyPerformanceChartProps {
  data: SeriesData;
  metricKey: string;
}

export const DailyPerformanceChart: React.FC<DailyPerformanceChartProps> = ({
  data,
  metricKey,
}) => {
  const styles = useStyles();
  const { theme } = useThemeStore();

  const echartsOption = useMemo(() => {
    const activeSeries = data.series.find((s) => s.key === metricKey);
    if (!activeSeries || !activeSeries.points) {
      return {};
    }

    const yAxisLabel = activeSeries.label || '';

    const pointsByDate = new Map<string, { [channel: string]: number }>();
    const channels = new Set<string>();
    activeSeries.points.forEach((point) => {
      if (point.channel) {
        channels.add(point.channel);
        if (!pointsByDate.has(point.date)) {
          pointsByDate.set(point.date, {});
        }
        pointsByDate.get(point.date)![point.channel] = point.y;
      }
    });

    const sortedDates = Array.from(pointsByDate.keys()).sort();

    const seriesForEcharts = Array.from(channels).map((channel) => ({
      name: channel,
      type: 'line',
      smooth: true,
      symbol: 'none',
      data: sortedDates.map((date) => pointsByDate.get(date)?.[channel] ?? null),
      emphasis: {
        focus: 'series',
      },
    }));

    // --- REFACTORED ECHARTS OPTION (following 'stories' remote pattern) ---
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params: any[]) => {
          if (!params || params.length === 0) return '';
          const date = new Date(params[0].axisValueLabel).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
          let tooltipHtml = `${date}<br/>`;
          params.forEach((item: any) => {
            if (item.value !== undefined && item.value !== null) {
              tooltipHtml += `${item.marker} ${item.seriesName}: <strong>${item.value.toFixed(1)}%</strong><br/>`;
            }
          });
          return tooltipHtml;
        },
      },
      legend: {
        data: Array.from(channels),
        bottom: 0,
        icon: 'circle',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: sortedDates.map((d) =>
          new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        ),
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        nameLocation: 'end',
        nameTextStyle: {
          align: 'left',
          verticalAlign: 'bottom',
          padding: [0, 0, 10, 0],
        },
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: seriesForEcharts,
    };
  }, [data, metricKey]);

  return (
    <section>
      <Text as="h2" size={500} weight="semibold">
        Daily Performance
      </Text>
      <Card className={styles.card}>
        <ReactECharts
          option={echartsOption}
          theme={theme} // <-- Use the built-in theme prop like in 'stories'
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </Card>
    </section>
  );
};

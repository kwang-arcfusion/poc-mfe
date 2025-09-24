// packages/ui/src/components/Chat/AssetTabs.tsx
import * as React from 'react';
import type { AssetGroup, ChartAsset } from '@arcfusion/types';
import { SqlTableTabs } from './SqlTableTabs';

/**
 * Helper function สำหรับคำนวณพื้นที่ด้านซ้ายที่แกน Y ต้องการ
 */
function calculateYAxisLeftMargin(yAxisConfig: any): number {
  if (!yAxisConfig) return 60;

  const max = yAxisConfig.max || 100;
  const formatter = yAxisConfig.axisLabel?.formatter || '{value}';
  const formattedMaxValue = formatter.replace('{value}', max.toString());

  const CHARACTER_WIDTH = 8;
  const PADDING = 30;
  const requiredWidth = formattedMaxValue.length * CHARACTER_WIDTH + PADDING;

  return Math.max(60, requiredWidth);
}

export function AssetTabs({ group, messageId }: { group: AssetGroup; messageId?: string }) {
  const processedCharts = React.useMemo(() => {
    return group.charts.map((ch) => {
      const newConfig = JSON.parse(JSON.stringify(ch.config));
      const source = newConfig.dataset?.source || newConfig.dataset?.[0]?.source;
      const series = newConfig.series;

      const isGraphicCard =
        Array.isArray(newConfig.graphic) && newConfig.graphic.length > 0 && !series;

      // ✨ [FINAL KPI FIX] ถ้าเป็น KPI Card ให้ "ลบ" แกนและข้อมูลที่ไม่จำเป็นทิ้ง
      if (isGraphicCard) {
        delete newConfig.xAxis;
        delete newConfig.yAxis;
        delete newConfig.dataset; // ลบ dataset ที่ไม่ถูกใช้งานด้วย
        if (newConfig.legend) newConfig.legend.show = false;
      }

      if (
        newConfig.xAxis?.type === 'time' &&
        Array.isArray(series) &&
        series.some((s) => s.type === 'bar')
      ) {
        newConfig.xAxis.type = 'category';
      }

      let dynamicHeight = 400;
      let dynamicWidth: number | undefined = undefined;
      const isHorizontal = newConfig.yAxis?.type === 'category';

      if (isHorizontal) {
        if (Array.isArray(series)) {
          const numLabels = newConfig.yAxis?.data?.length || 0;
          const numSeries = series.length;
          if (numLabels > 0 && numSeries > 0) {
            const PIXELS_PER_BAR = 22;
            const GROUP_PADDING = 15;
            const PADDING_TOP_BOTTOM = 120;
            const heightPerGroup = numSeries * PIXELS_PER_BAR + GROUP_PADDING;
            const calculatedHeight = numLabels * heightPerGroup + PADDING_TOP_BOTTOM;
            dynamicHeight = Math.max(400, calculatedHeight);
          }
        }
      } else if (newConfig.xAxis && Array.isArray(series)) {
        const isVerticalBarChart = series.some((s) => s.type === 'bar');

        if (isVerticalBarChart) {
          const xLabels =
            newConfig.xAxis.data ||
            (source && series?.[0]?.encode?.x
              ? [...new Set(source.map((r: any) => r[series[0].encode.x]))]
              : []);
          const numLabels = xLabels.length;
          const numSeries = series.length;

          if (numLabels * numSeries > 25) {
            const BAR_WIDTH = 35;
            const GROUP_PADDING = 25;
            const widthPerGroup = numSeries * BAR_WIDTH + GROUP_PADDING;
            const calculatedWidth = numLabels * widthPerGroup;
            dynamicWidth = Math.max(800, calculatedWidth);

            if (newConfig.xAxis.axisLabel) newConfig.xAxis.axisLabel.rotate = 0;

            newConfig.dataZoom = [
              { type: 'slider', start: 0, end: (15 / numLabels) * 100, bottom: 30 },
            ];
            if (newConfig.grid) newConfig.grid.bottom = '18%';
          } else if (numLabels > 8) {
            if (newConfig.xAxis.axisLabel) newConfig.xAxis.axisLabel.rotate = 30;
            else newConfig.xAxis.axisLabel = { rotate: 30 };
          }
        }
      }

      if (source && Array.isArray(series)) {
        series.forEach((seriesItem: any) => {
          if (seriesItem.type === 'bar') {
            seriesItem.labelLayout = { hideOverlap: true };
            if (series.length > 2 && seriesItem.label) {
              seriesItem.label.fontSize = 10;
            }
          }

          if (!seriesItem.encode) return;
          const xKey = seriesItem.encode.x;
          const yKey = seriesItem.encode.y;
          if (isHorizontal) {
            const yAxisData = source.map((row: any) => row[yKey]);
            const seriesData = source.map((row: any) => {
              const value = row[xKey];
              return typeof value === 'object' ? 0 : parseFloat(value) || 0;
            });
            if (newConfig.yAxis) {
              newConfig.yAxis.data = newConfig.yAxis.data || yAxisData;
            }
            seriesItem.data = seriesData;
          } else {
            const xAxisData = source.map((row: any) => row[xKey]);
            const seriesData = source.map((row: any) => {
              const value = row[yKey];
              return typeof value === 'object' ? 0 : parseFloat(value) || 0;
            });
            if (newConfig.xAxis) {
              newConfig.xAxis.data = newConfig.xAxis.data || xAxisData;
            }
            seriesItem.data = seriesData;
          }
          delete seriesItem.encode;
        });
        delete newConfig.dataset;
      }

      if (newConfig.tooltip) {
        newConfig.tooltip.formatter = (params: any) => {
          if (!Array.isArray(params) || params.length === 0 || isGraphicCard) return '';
          let tooltipHtml = `${params[0].axisValueLabel || params[0].name}<br/>`;
          params.forEach((param: any) => {
            const value = param.value?.[param.encode?.y?.[0]] ?? param.value;
            const formattedValue =
              typeof value === 'number'
                ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : 'N/A';
            tooltipHtml += `${param.marker} ${param.seriesName}: <strong>${formattedValue}</strong><br/>`;
          });
          return tooltipHtml;
        };
      }

      if (newConfig.legend) {
        newConfig.legend.top = 'bottom';
        newConfig.legend.type = 'scroll';
      }

      newConfig.grid = {
        containLabel: true,
        ...newConfig.grid,
      };

      if (!isHorizontal && !isGraphicCard) {
        newConfig.grid.left = calculateYAxisLeftMargin(newConfig.yAxis);
      }

      if (newConfig.title?.text && newConfig.yAxis?.name) {
        newConfig.grid.top = Math.max(newConfig.grid.top || 60, 90);
      }

      return { ...ch, processedConfig: newConfig, dynamicHeight, dynamicWidth };
    });
  }, [group.charts]);

  if (group.sqls.length === 0 && processedCharts.length === 0) {
    return null;
  }

  return (
    <SqlTableTabs
      sql={group.sqls[0]}
      dataframe={group.dataframes[0]}
      chart={processedCharts[0]}
      messageId={messageId}
    />
  );
}

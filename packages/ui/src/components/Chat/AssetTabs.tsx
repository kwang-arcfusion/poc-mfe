// packages/ui/src/components/Chat/AssetTabs.tsx
import * as React from 'react';
import type { AssetGroup, ChartAsset } from '@arcfusion/types';
import { SqlTableTabs } from './SqlTableTabs';

export function AssetTabs({ group, messageId }: { group: AssetGroup; messageId?: string }) {
  const processedCharts = React.useMemo(() => {
    return group.charts.map((ch) => {
      const newConfig = JSON.parse(JSON.stringify(ch.config));
      const source = newConfig.dataset?.source || newConfig.dataset?.[0]?.source;
      const series = newConfig.series;

      // ตรวจจับและแก้ไขปัญหากราฟ Bar Chart ที่ใช้แกนเวลา (Time Axis)
      if (
        newConfig.xAxis?.type === 'time' &&
        Array.isArray(series) &&
        series.some((s) => s.type === 'bar')
      ) {
        newConfig.xAxis.type = 'category';
      }

      // คำนวณความสูงและความกว้างแบบไดนามิก
      let dynamicHeight = 400;
      let dynamicWidth: number | undefined = undefined;
      const isHorizontal = newConfig.yAxis?.type === 'category';

      if (isHorizontal) {
        // Logic การคำนวณ dynamicHeight สำหรับกราฟแนวนอน
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
        // ✨ [IMPROVEMENT] คำนวณ dynamicWidth "เฉพาะกราฟแท่ง" เท่านั้น
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

            if (newConfig.xAxis.axisLabel) {
              newConfig.xAxis.axisLabel.rotate = 0;
            }
          } else if (numLabels > 8) {
            if (newConfig.xAxis.axisLabel) {
              newConfig.xAxis.axisLabel.rotate = 30;
            } else {
              newConfig.xAxis.axisLabel = { rotate: 30 };
            }
          }
        }
      }

      // ... (โค้ดประมวลผล config ที่เหลือทั้งหมดเหมือนเดิม)
      if (Array.isArray(newConfig.graphic) && newConfig.graphic.length > 0 && !series) {
        if (newConfig.legend) newConfig.legend.show = false;
      } else if (source && Array.isArray(series)) {
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
        delete newConfig.tooltip.valueFormatter;
        newConfig.tooltip.formatter = (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
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
      } else {
        newConfig.legend = { top: 'bottom', type: 'scroll' };
      }

      newConfig.grid = {
        containLabel: true,
        ...newConfig.grid,
      };

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

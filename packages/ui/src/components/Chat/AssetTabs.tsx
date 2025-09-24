import * as React from 'react';
import type { AssetGroup, ChartAsset } from '@arcfusion/types';
import { SqlTableTabs } from './SqlTableTabs';

/**
 * Helper function สำหรับคำนวณพื้นที่ด้านซ้ายที่แกน Y ต้องการ
 * โดยจะดูจากค่า max และ format ของ label เพื่อหาความยาวตัวอักษรที่มากที่สุด
 */
function calculateYAxisLeftMargin(yAxisConfig: any): number {
  if (!yAxisConfig) return 60; // ค่า Default

  const max = yAxisConfig.max || 100;
  const formatter = yAxisConfig.axisLabel?.formatter || '{value}';
  const formattedMaxValue = formatter.replace('{value}', max.toString());

  const CHARACTER_WIDTH = 8; // ความกว้างเฉลี่ยของตัวอักษร
  const PADDING = 30; // ระยะห่างเผื่อสำหรับชื่อแกน และอื่นๆ
  const requiredWidth = formattedMaxValue.length * CHARACTER_WIDTH + PADDING;

  return Math.max(60, requiredWidth); // ต้องมีพื้นที่อย่างน้อย 60px
}

export function AssetTabs({ group, messageId }: { group: AssetGroup; messageId?: string }) {
  const processedCharts = React.useMemo(() => {
    return group.charts.map((ch) => {
      const newConfig = JSON.parse(JSON.stringify(ch.config));
      const source = newConfig.dataset?.source || newConfig.dataset?.[0]?.source;
      const series = newConfig.series;

      // Logic 1: แก้ไขแกน time ของ bar chart ให้เป็น category
      if (
        newConfig.xAxis?.type === 'time' &&
        Array.isArray(series) &&
        series.some((s) => s.type === 'bar')
      ) {
        newConfig.xAxis.type = 'category';
      }

      // Logic 2: คำนวณความสูงและความกว้างแบบไดนามิก
      let dynamicHeight = 400;
      let dynamicWidth: number | undefined = undefined;
      const isHorizontal = newConfig.yAxis?.type === 'category';

      if (isHorizontal) {
        // คำนวณ dynamicHeight สำหรับกราฟแนวนอน
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
        // สำหรับกราฟแนวตั้ง
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
            // คำนวณ dynamicWidth
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

      // Logic 3: ประมวลผลข้อมูลตามโครงสร้าง
      if (Array.isArray(newConfig.graphic) && newConfig.graphic.length > 0 && !series) {
        if (newConfig.legend) newConfig.legend.show = false;
      } else if (source && Array.isArray(series)) {
        series.forEach((seriesItem: any) => {
          // จัดการ label ซ้อนทับกัน
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

      // Logic 4: การปรับปรุงทั่วไป (Universal Adjustments)
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

      // Logic 5: ปรับแก้ Grid Layout เป็นขั้นตอนสุดท้าย
      newConfig.grid = {
        containLabel: true,
        ...newConfig.grid,
      };

      if (!isHorizontal) {
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

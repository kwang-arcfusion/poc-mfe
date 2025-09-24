// packages/ui/src/components/Chat/AssetTabs.tsx
import * as React from 'react';
import type { AssetGroup } from '@arcfusion/types';
import { SqlTableTabs } from './SqlTableTabs';

export function AssetTabs({ group, messageId }: { group: AssetGroup; messageId?: string }) {
  const processedCharts = React.useMemo(() => {
    return group.charts.map((ch) => {
      // ✨ 1. เริ่มต้นด้วยการ deep copy config เพื่อไม่ให้กระทบ object เดิม
      const newConfig = JSON.parse(JSON.stringify(ch.config));
      const source = newConfig.dataset?.source || newConfig.dataset?.[0]?.source;
      const series = newConfig.series;

      // ✨ 2. กรณีเป็น KPI Card ที่ใช้ graphic แสดงผล (ไม่มี series)
      if (Array.isArray(newConfig.graphic) && newConfig.graphic.length > 0 && !series) {
        // ไม่ต้องทำอะไรมาก แค่ปรับ legend
        if (newConfig.legend) newConfig.legend.show = false;

        // ✨ 3. กรณีที่ข้อมูลมาจาก dataset และมีการใช้ encode (ส่วนใหญ่)
      } else if (source && Array.isArray(series)) {
        // ✨ 4. วนลูปทุก series ที่มี ไม่ใช่แค่ series[0]
        series.forEach((seriesItem: any) => {
          if (!seriesItem.encode) return;

          const xKey = seriesItem.encode.x;
          const yKey = seriesItem.encode.y;

          // ✨ 5. ตรวจสอบว่าเป็นกราฟแท่งแนวนอนหรือไม่ (Horizontal Bar Chart)
          if (newConfig.yAxis?.type === 'category') {
            const yAxisData = source.map((row: any) => row[yKey]);
            const seriesData = source.map((row: any) => {
              const value = row[xKey];
              return typeof value === 'object' ? 0 : parseFloat(value) || 0;
            });

            // ใช้ yAxis.data ที่มีอยู่แล้ว หรือสร้างขึ้นใหม่
            if (newConfig.yAxis) {
              newConfig.yAxis.data = newConfig.yAxis.data || yAxisData;
            }
            seriesItem.data = seriesData;

            // ✨ 6. กรณีเป็นกราฟแนวตั้ง (Vertical Bar/Line Chart)
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
          // ✨ 7. ลบ encode property ออกหลังใช้งานเสร็จ
          delete seriesItem.encode;
        });

        // ✨ 8. ลบ dataset property ออกหลังใช้งานเสร็จ
        delete newConfig.dataset;
      }
      // ✨ (กรณีอื่นๆ เช่น data อยู่ใน series.data อยู่แล้ว จะไม่ต้องทำอะไรเป็นพิเศษ)

      // =================== การปรับปรุงทั่วไป (Universal Adjustments) ===================
      if (newConfig.tooltip) {
        delete newConfig.tooltip.valueFormatter;

        // formatter สำหรับ tooltip ให้ยืดหยุ่นขึ้น
        newConfig.tooltip.formatter = (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          let tooltipHtml = `${params[0].axisValueLabel || params[0].name}<br/>`;
          params.forEach((param: any) => {
            const value = param.value[param.encode?.y?.[0]] ?? param.value;
            const formattedValue =
              typeof value === 'number'
                ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : 'N/A';
            tooltipHtml += `${param.marker} ${param.seriesName}: <strong>${formattedValue}</strong><br/>`;
          });
          return tooltipHtml;
        };
      }

      // ✨ 9. จัดการ Legend และ Grid ให้มีมาตรฐานเดียวกัน
      if (newConfig.legend) {
        newConfig.legend.top = 'bottom';
      } else {
        newConfig.legend = { top: 'bottom' };
      }

      if (newConfig.grid) {
        newConfig.grid.bottom = '12%';
      } else {
        newConfig.grid = { bottom: '12%' };
      }

      return { ...ch, processedConfig: newConfig };
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

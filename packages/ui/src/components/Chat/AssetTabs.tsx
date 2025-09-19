// packages/ui/src/components/Chat/AssetTabs.tsx
import * as React from 'react';
import type { AssetGroup } from '@arcfusion/types';
import { SqlTableTabs } from './SqlTableTabs';

export function AssetTabs({ group, messageId }: { group: AssetGroup; messageId?: string }) {
  const processedCharts = React.useMemo(() => {
    return group.charts.map((ch) => {
      const newConfig = JSON.parse(JSON.stringify(ch.config));
      const source = newConfig.dataset?.source;
      const seriesConfig = newConfig.series?.[0];

      if (source && seriesConfig?.encode) {
        const xKey = seriesConfig.encode.x;
        const yKey = seriesConfig.encode.y;

        if (newConfig.yAxis?.type === 'category') {
          // Horizontal Bar Chart
          const yAxisData = source.map((row: any) => row[yKey]);
          const seriesData = source.map((row: any) => {
            const value = row[xKey];
            return typeof value === 'object' ? 0 : parseFloat(value) || 0;
          });

          if (newConfig.yAxis) {
            newConfig.yAxis.data = yAxisData;
          }
          if (newConfig.series?.[0]) {
            newConfig.series[0].data = seriesData;
          }
        } else {
          // Vertical Bar Chart (Original Logic)
          const xAxisData = source.map((row: any) => row[xKey]);
          const seriesData = source.map((row: any) => {
            const value = row[yKey];
            return typeof value === 'object' ? 0 : parseFloat(value) || 0;
          });

          if (newConfig.xAxis) {
            newConfig.xAxis.data = xAxisData;
          }
          if (newConfig.series?.[0]) {
            newConfig.series[0].data = seriesData;
          }
        }

        // Delete processed properties
        delete newConfig.dataset;
        if (newConfig.series?.[0]) {
          delete newConfig.series[0].encode;
        }
        // =================== END EDIT ===================

        if (newConfig.tooltip) {
          delete newConfig.tooltip.valueFormatter;

          newConfig.tooltip.formatter = (params: any) => {
            if (!Array.isArray(params) || params.length === 0) return '';
            const param = params[0];
            const categoryName = param.name;
            const value = param.value;
            const formattedValue = typeof value === 'number' ? value.toFixed(2) : 'N/A';
            return `${categoryName}: ${formattedValue}%`;
          };
        }

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
      }
      return { ...ch, processedConfig: newConfig };
    });
  }, [group.charts]);

  if (group.sqls.length === 0 || group.dataframes.length === 0) {
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

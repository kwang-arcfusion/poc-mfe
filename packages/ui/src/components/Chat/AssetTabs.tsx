// packages/ui/src/components/AssetTabs.tsx
import * as React from 'react';
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';
import type { AssetGroup } from '@arcfusion/types';
import { SqlTableTabs } from './SqlTableTabs';

const useStyles = makeStyles({
  assetGroup: {
    ...shorthands.border('2px', 'solid', tokens.colorNeutralStroke2),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    backgroundColor: tokens.colorNeutralBackground3,
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
  },
});

export function AssetTabs({ group, messageId }: { group: AssetGroup; messageId?: string }) {
  const styles = useStyles();

  const processedCharts = React.useMemo(() => {
    return group.charts.map((ch) => {
      const newConfig = JSON.parse(JSON.stringify(ch.config));
      const source = newConfig.dataset?.source;
      const seriesConfig = newConfig.series?.[0];

      if (source && seriesConfig?.encode) {
        const xKey = seriesConfig.encode.x;
        const yKey = seriesConfig.encode.y;

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

        delete newConfig.dataset;
        if (newConfig.series?.[0]) {
          delete newConfig.series[0].encode;
        }

        if (newConfig.tooltip) {
          newConfig.tooltip.formatter = (params: any) => {
            if (!Array.isArray(params) || params.length === 0) return '';
            const param = params[0];
            const categoryName = param.name;
            const value = param.value;
            const formattedValue = typeof value === 'number' ? value.toFixed(2) : 'N/A';
            return `${categoryName}: ${formattedValue}%`;
          };
        }

        // ✨ START: ปรับแก้ Layout ของ Legend และ Grid เพื่อไม่ให้ซ้อนกัน
        // 1. ย้าย Legend ไปไว้ด้านล่าง
        if (newConfig.legend) {
          newConfig.legend.top = 'bottom';
        } else {
          // ถ้าไม่มี object legend มาให้ ก็สร้างขึ้นมาใหม่
          newConfig.legend = { top: 'bottom' };
        }

        // 2. ปรับขนาดของ Grid (พื้นที่วาดกราฟ) ให้มีที่ว่างสำหรับ Legend ด้านล่าง
        if (newConfig.grid) {
          newConfig.grid.bottom = '12%'; // เพิ่มระยะห่างจากขอบล่าง 12%
        } else {
          newConfig.grid = { bottom: '12%' };
        }
        // ✨ END: สิ้นสุดการแก้ไข
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

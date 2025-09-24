// packages/ui/src/components/Chat/AssetTabs.tsx
import * as React from 'react';
import type { AssetGroup } from '@arcfusion/types';
import { SqlTableTabs } from './SqlTableTabs';

export function AssetTabs({ group, messageId }: { group: AssetGroup; messageId?: string }) {
  // --- START EDIT ---
  // ปรับแก้ useMemo ส่วนนี้ให้ใช้ config ที่ได้จาก API โดยตรง
  // โดยไม่ต้องมี Logic การปรับแก้ที่ซับซ้อนอีกต่อไป
  const processedCharts = React.useMemo(() => {
    return group.charts.map((chart) => {
      return {
        ...chart,
        processedConfig: chart.config, // ใช้ config ที่ได้รับมาโดยตรง
      };
    });
  }, [group.charts]);
  // --- END EDIT ---

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

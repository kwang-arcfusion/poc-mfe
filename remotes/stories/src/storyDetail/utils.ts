// remotes/stories/src/storyDetail/utils.ts
import type { Story } from '@arcfusion/types';
import type { KpiCardProps } from './KpiCard';

// ฟังก์ชันนี้จะแปลงข้อมูล story จาก API ไปเป็น props ที่ KpiCard ต้องการ
export const transformStoryToKpis = (story: Story): KpiCardProps[] => {
  const kpis: KpiCardProps[] = [];

  const topMover = story.top_movers && story.top_movers.length > 0 ? story.top_movers[0] : null;
  const triggerEvalDetails = story.metadata_info?.trigger_evaluation?.details?.[0];

  if (topMover && triggerEvalDetails) {
    // KPI Card 1: แสดงค่าล่าสุด
    kpis.push({
      label: `${topMover.name} - Current Value`,
      value: `${triggerEvalDetails.latest?.toFixed(2) || 'N/A'}`,
      chips: [story.metric_label],
      definition: story.about,
    });

    // KPI Card 2: แสดงค่าก่อนหน้า
    kpis.push({
      label: `${topMover.name} - Previous Value`,
      value: `${triggerEvalDetails.prev?.toFixed(2) || 'N/A'}`,
      chips: ['Comparison Period'],
    });

    // KPI Card 3: แสดงค่าการเปลี่ยนแปลง
    kpis.push({
      label: 'Change vs Previous',
      value: `${topMover.change.toFixed(2)}%`,
      delta: {
        direction: topMover.direction,
        text: `${topMover.direction === 'down' ? 'Decrease' : 'Increase'}`,
      },
    });
  }

  // KPI Card 4: แสดงข้อมูลทั่วไป
  kpis.push({
      label: 'Story Type',
      value: story.type,
      chips: [`ID: ${story.id.substring(0, 8)}...`],
  });

  return kpis;
};
import type { Story } from '@arcfusion/types';
import type { KpiCardProps } from './KpiCard';

export const transformStoryToKpis = (story: Story): KpiCardProps[] => {
  const kpis: KpiCardProps[] = [];

  const topMover = story.top_movers && story.top_movers.length > 0 ? story.top_movers[0] : null;
  const triggerEvalDetails = story.metadata_info?.trigger_evaluation?.details?.[0];

  if (topMover && triggerEvalDetails) {
    kpis.push({
      label: `${topMover.name} - Current Value`,
      value: `${triggerEvalDetails.latest?.toFixed(2) || 'N/A'}`,
      chips: [story.metric_label],
      definition: story.about,
    });

    kpis.push({
      label: `${topMover.name} - Previous Value`,
      value: `${triggerEvalDetails.prev?.toFixed(2) || 'N/A'}`,
      chips: ['Comparison Period'],
    });

    kpis.push({
      label: 'Change vs Previous',
      value: `${topMover.change.toFixed(2)}%`,
      delta: {
        direction: topMover.direction,
        text: `${topMover.direction === 'down' ? 'Decrease' : 'Increase'}`,
      },
    });
  }

  kpis.push({
      label: 'Story Type',
      value: story.type,
      chips: [`ID: ${story.id.substring(0, 8)}...`],
  });

  return kpis;
};
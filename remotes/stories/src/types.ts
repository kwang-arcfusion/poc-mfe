// remotes/stories/src/types.ts
// This file defines the shape of our data.
export interface Story {
  id: string;
  platform: {
    name: string;
    icon: string;
  };
  timestamp: Date;
  timeAgo: string;
  kpi: {
    value: string;
    title: string;
    metric: string;
    tag?: string;
  };
  chartHighlightLabel: string;
  summary: string; // Can contain HTML like <strong>
}

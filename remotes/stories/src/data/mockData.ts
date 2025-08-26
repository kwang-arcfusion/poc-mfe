// remotes/stories/src/data/mockData.ts
import { Story } from '../types';

// Helper function to create a date relative to today
const getDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(10, 0, 0, 0); // Set a consistent time
  return date;
};

// --- Mock Data for Stories Page ---
// This data simulates what you might get from an API.
export const mockStories: Story[] = [
  // --- Today's Stories (6) ---
  {
    id: 'story-01',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(0),
    timeAgo: 'about 2 hours ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase Lorem ipsum dolor sit amet consectetur adipisicing elit.',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Today',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-02',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(0),
    timeAgo: 'about 3 hours ago',
    kpi: {
      value: '+25%',
      metric: 'Engagement',
      title: 'Summer Sale Campaign',
      tag: 'Highest Peak',
    },
    chartHighlightLabel: 'Today',
    summary: 'Engagement <strong>surged</strong> this morning, driven by the new video creative.',
  },
  {
    id: 'story-03',
    platform: { name: 'Google', icon: 'G' },
    timestamp: getDate(0),
    timeAgo: 'about 4 hours ago',
    kpi: { value: '-15%', metric: 'CTR', title: 'Search Ads' },
    chartHighlightLabel: 'Today',
    summary: 'Click-Through Rate for top keywords has <strong>declined</strong> since yesterday.',
  },
  {
    id: 'story-04',
    platform: { name: 'TikTok', icon: 't' },
    timestamp: getDate(0),
    timeAgo: 'about 5 hours ago',
    kpi: { value: '+150%', metric: 'Video Views', title: 'Organic Post #123' },
    chartHighlightLabel: 'Today',
    summary: 'A recent video is <strong>going viral</strong>, far exceeding typical view counts.',
  },
  {
    id: 'story-05',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(0),
    timeAgo: 'about 6 hours ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Today',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-06',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(0),
    timeAgo: 'about 7 hours ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Today',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },

  // --- Yesterday's Stories (5) ---
  {
    id: 'story-07',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(1),
    timeAgo: 'about 1 day ago',
    kpi: { value: '-30%', metric: 'ROAS', title: 'Q3 Campaign' },
    chartHighlightLabel: 'Yesterday',
    summary:
      'Return on Ad Spend has seen a <strong>steady decline</strong> over the past 24 hours.',
  },
  {
    id: 'story-08',
    platform: { name: 'Google', icon: 'G' },
    timestamp: getDate(1),
    timeAgo: 'about 1 day ago',
    kpi: { value: '+5%', metric: 'Impressions', title: 'Display Network' },
    chartHighlightLabel: 'Yesterday',
    summary: 'Impressions are slightly up, but CTR remains flat.',
  },
  {
    id: 'story-09',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(1),
    timeAgo: 'about 1 day ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Yesterday',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-10',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(1),
    timeAgo: 'about 1 day ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Yesterday',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-11',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(1),
    timeAgo: 'about 1 day ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Yesterday',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },

  // --- Older Stories (6) ---
  {
    id: 'story-12',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(12),
    timeAgo: 'about 12 days ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Aug 14',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-13',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(12),
    timeAgo: 'about 12 days ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Aug 14',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-14',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(12),
    timeAgo: 'about 12 days ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Aug 14',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-15',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(12),
    timeAgo: 'about 12 days ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Aug 14',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-16',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(12),
    timeAgo: 'about 12 days ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Aug 14',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
  {
    id: 'story-17',
    platform: { name: 'Facebook', icon: 'f' },
    timestamp: getDate(12),
    timeAgo: 'about 12 days ago',
    kpi: {
      value: '-62%',
      metric: 'Conversion Rate',
      title: 'ArcFusionElite Purchase',
      tag: 'Steepest 2-Day Drop',
    },
    chartHighlightLabel: 'Aug 14',
    summary:
      'Conversions <strong>dropped significantly</strong> from 34 to 13, now 46% below the weekly average.',
  },
];

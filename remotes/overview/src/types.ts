// Data for each Metric Card
export interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  isCurrency?: boolean;
  sparklineData?: number[];
}

// Data for the Daily Performance chart (each point)
export interface DailyDataPoint {
  date: string; // "YYYY-MM-DD"
  value: number;
}

// Data for the By Channel table (each row)
export interface ChannelPerformance {
  channel: 'Facebook' | 'Google' | 'TikTok' | 'Other';
  impr: number;
  reach: number;
  clicks: number;
  ctr: number;
  cost: number;
  leads: number;
  purch: number;
  conv: number;
  cvr: number;
}

// Overall data structure for the Overview page
export interface OverviewData {
  metrics: Metric[];
  dailyPerformance: DailyDataPoint[];
  channelPerformance: ChannelPerformance[];
}

// State for Filters
export interface FilterValues {
  campaigns?: string[];
  ads?: string[];
  channels?: string[];
}

// State for Filters
export interface FilterValues {
  channels?: string[];
  campaigns?: string[];
  ads?: string[];
  groupBy?: string[];
  metrics?: string[];
}

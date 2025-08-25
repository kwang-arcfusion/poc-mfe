// ข้อมูลสำหรับ Metric Card แต่ละใบ
export interface Metric {
  id: string;
  title: string;
  value: number;
  change: number;
  isCurrency?: boolean;
  sparklineData?: number[];
}

// ข้อมูลสำหรับกราฟ Daily Performance (แต่ละจุด)
export interface DailyDataPoint {
  date: string; // "YYYY-MM-DD"
  value: number;
}

// ข้อมูลสำหรับตาราง By Channel (แต่ละแถว)
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

// โครงสร้างข้อมูลทั้งหมดสำหรับหน้า Overview
export interface OverviewData {
  metrics: Metric[];
  dailyPerformance: DailyDataPoint[];
  channelPerformance: ChannelPerformance[];
}

// State สำหรับการ Filter
export interface FilterValues {
  campaigns?: string[];
  ads?: string[];
  channels?: string[];
}

// State สำหรับการ Filter
export interface FilterValues {
  channels?: string[];
  campaigns?: string[];
  ads?: string[];
  groupBy?: string[];
  metrics?: string[];
}

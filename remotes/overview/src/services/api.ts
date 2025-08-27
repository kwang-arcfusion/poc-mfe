// remotes/overview/src/services/api.ts
import { OverviewData } from '../types';

// --- ⬇️ [1] Create a function to generate small sparkline data ⬇️ ---
const generateSparkline = () => Array.from({ length: 12 }, () => Math.random() * 100 + 50);

// --- ⬇️ [2] Add `sparklineData` to each metric ⬇️ ---
const mockData: OverviewData = {
  metrics: [
    {
      id: 'impr',
      title: 'Impressions',
      value: 302000,
      change: 4.6,
      sparklineData: generateSparkline(),
    },
    { id: 'reach', title: 'Reach', value: 200000, change: 4.6, sparklineData: generateSparkline() },
    { id: 'clicks', title: 'Clicks', value: 7250, change: 4.6, sparklineData: generateSparkline() },
    { id: 'leads', title: 'Leads', value: 960, change: 4.6, sparklineData: generateSparkline() },
    {
      id: 'purch',
      title: 'Purchases',
      value: 302,
      change: 1.2,
      sparklineData: generateSparkline(),
    },
    {
      id: 'conv',
      title: 'Conversions',
      value: 200,
      change: -0.5,
      sparklineData: generateSparkline(),
    },
    {
      id: 'cvr',
      title: 'Conversion Rate (CVR)',
      value: 72.5,
      change: 2.1,
      sparklineData: generateSparkline(),
    },
    {
      id: 'ctr',
      title: 'Click-Through Rate (CTR)',
      value: 2.4,
      change: 0.1,
      sparklineData: generateSparkline(),
    },
    {
      id: 'cpc',
      title: 'Cost per Click',
      value: 1.2,
      change: -3.0,
      isCurrency: true,
      sparklineData: generateSparkline(),
    },
    {
      id: 'installs',
      title: 'App Installs',
      value: 1500,
      change: 5.0,
      sparklineData: generateSparkline(),
    },
    {
      id: 'cost',
      title: 'Cost',
      value: 8700,
      change: 10.3,
      isCurrency: true,
      sparklineData: generateSparkline(),
    },
  ],
  dailyPerformance: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: 5000 + Math.sin(i / 3) * 2000 + Math.random() * 1000,
    };
  }),
  channelPerformance: [
    {
      channel: 'Facebook',
      impr: 120000,
      reach: 90000,
      clicks: 3200,
      ctr: 2.7,
      cost: 2300,
      leads: 300,
      purch: 120,
      conv: 180,
      cvr: 5.6,
    },
    {
      channel: 'Google',
      impr: 90000,
      reach: 76000,
      clicks: 2100,
      ctr: 2.3,
      cost: 2600,
      leads: 400,
      purch: 160,
      conv: 140,
      cvr: 4.9,
    },
    {
      channel: 'TikTok',
      impr: 60000,
      reach: 44000,
      clicks: 1500,
      ctr: 2.5,
      cost: 1200,
      leads: 260,
      purch: 100,
      conv: 90,
      cvr: 4.2,
    },
  ],
};

// Simulate fetching data
export const fetchOverviewData = (filters?: any): Promise<OverviewData> => {
  console.log('Fetching data with filters:', filters);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 800);
  });
};

// remotes/overview/src/services/api.ts
import {
  AnalyticsOptions,
  MetricOption,
  OverviewApiResponse,
  FilterValues,
  TableRowData,
} from '../types';
import type { DateRange, OptionGroup } from '@arcfusion/ui';

// --- Master Mock Database for Performance Cards ---
const ALL_MOCK_PERFORMANCE_DATA = [
  {
    id: 'PREPAID_TO_POSTPAID_Q4_Offer',
    title: 'PREPAID_TO_POSTPAID_Q4_Offer',
    campaignName: 'PREPAID_TO_POSTPAID_Q4_Program',
    growth: 25.1,
    metrics: [
      { label: 'Impressions', value: 150000000 },
      { label: 'Clicks', value: 550000 },
    ],
  },
  {
    id: 'WINBACK_14GB_50THB_Offer',
    title: 'WINBACK_14GB_50THB_Offer',
    campaignName: 'WINBACK_14GB_50THB_Program',
    growth: 12.1,
    metrics: [
      { label: 'Impressions', value: 98200000 },
      { label: 'Clicks', value: 410000 },
    ],
  },
  {
    id: 'CP_FamilyPack_Discount_Aug_Offer',
    title: 'CP_FamilyPack_Discount_Aug_Offer',
    campaignName: 'GENERAL_PROMOTIONS',
    metrics: [
      { label: 'Impressions', value: 75000000 },
      { label: 'Engagement', value: 5400000 },
    ],
  },
  {
    id: 'NewUser_Welcome_Voucher',
    title: 'NewUser_Welcome_Voucher_For_New_Subscribers_Only',
    campaignName: 'GENERAL_PROMOTIONS',
    growth: 45.8,
    metrics: [
      { label: 'Impressions', value: 210000000 },
      { label: 'Clicks', value: 980000 },
    ],
  },
];

const ALL_MOCK_METRIC_OPTIONS: MetricOption[] = [
  { key: 'conversions_rate', label: 'Conversions Rate', type: 'percent' },
  { key: 'impression_rate', label: 'Impression Rate', type: 'percent' },
  { key: 'engagement_rate', label: 'Engagement Rate', type: 'percent' },
  { key: 'click_through_rate', label: 'Click-Through Rate (CTR)', type: 'percent' },
  { key: 'cost_per_click', label: 'Cost Per Click (CPC)', type: 'currency' },
  { key: 'return_on_ad_spend', label: 'ROAS', type: 'number' },
  { key: 'cost_per_acquisition', label: 'CPA', type: 'currency' },
];

// --- API Service Functions ---
export const fetchAnalyticsOptions = async (): Promise<AnalyticsOptions> => {
  await new Promise((res) => setTimeout(res, 200)); // Simulate network delay
  return {
    dimensions: [
      {
        key: 'channel',
        label: 'Channel',
        options: [
          { key: 'SMS', label: 'SMS' },
          { key: 'Email', label: 'Email' },
        ],
      },
    ],
    metrics: ALL_MOCK_METRIC_OPTIONS,
  };
};

export const fetchCampaignOffersByDate = async (dateRange: DateRange): Promise<OptionGroup[]> => {
  console.log('MOCK: Fetching campaign/offers for', dateRange);
  await new Promise((res) => setTimeout(res, 300));
  // In a real scenario, this would filter by date. Here, we return all for simplicity.
  return [
    {
      name: 'PREPAID_TO_POSTPAID_Q4_Program',
      children: [{ id: 'PREPAID_TO_POSTPAID_Q4_Offer', name: 'PREPAID_TO_POSTPAID_Q4_Offer' }],
    },
    {
      name: 'WINBACK_14GB_50THB_Program',
      children: [{ id: 'WINBACK_14GB_50THB_Offer', name: 'WINBACK_14GB_50THB_Offer' }],
    },
    {
      name: 'GENERAL_PROMOTIONS',
      children: [
        { id: 'CP_FamilyPack_Discount_Aug_Offer', name: 'CP_FamilyPack_Discount_Aug_Offer' },
        { id: 'NewUser_Welcome_Voucher', name: 'NewUser_Welcome_Voucher' },
      ],
    },
  ];
};

// ** NEW MOCK FUNCTION **
export const fetchAvailableChannelsForOffers = async (
  offerIds: string[]
): Promise<OptionGroup[]> => {
  console.log('MOCK: Fetching available channels for offers:', offerIds);
  await new Promise((res) => setTimeout(res, 250));
  // Mock logic: If a specific offer is selected, maybe it only uses SMS.
  if (offerIds.length === 1 && offerIds[0] === 'WINBACK_14GB_50THB_Offer') {
    return [
      {
        name: 'Channels',
        children: [{ id: 'SMS', name: 'SMS' }],
      },
    ];
  }
  // Otherwise, return all channels.
  return [
    {
      name: 'Channels',
      children: [
        { id: 'SMS', name: 'SMS' },
        { id: 'Email', name: 'Email' },
      ],
    },
  ];
};

export const fetchPerformanceSummary = async (filters: {
  dateRange: DateRange;
  offer_ids?: string[];
}): Promise<any[]> => {
  console.log('MOCK: Fetching performance summary with filters', filters);
  await new Promise((res) => setTimeout(res, 400));
  // If no offers are selected (empty array), it means "all"
  if (!filters.offer_ids || filters.offer_ids.length === 0) {
    return ALL_MOCK_PERFORMANCE_DATA;
  }
  return ALL_MOCK_PERFORMANCE_DATA.filter((item) => filters.offer_ids!.includes(item.id));
};

export const fetchOverviewData = async (
  dateRange: DateRange,
  filters: Omit<FilterValues, 'metrics'>,
  campaignOfferFilters: { offer_ids?: string[] }
): Promise<OverviewApiResponse> => {
  console.log('MOCK: Generating dynamic data for filters:', {
    dateRange,
    filters,
    campaignOfferFilters,
  });
  await new Promise((res) => setTimeout(res, 600));

  const start = dateRange.start || new Date();
  const end = dateRange.end || new Date();

  const isDrillDown = campaignOfferFilters?.offer_ids && campaignOfferFilters.offer_ids.length > 0;
  const valueMultiplier = isDrillDown ? 0.4 + Math.random() * 0.2 : 1;

  const cards = ALL_MOCK_METRIC_OPTIONS.map((metricInfo) => {
    let value = (Math.random() * 80 + 10) * valueMultiplier;
    if (metricInfo.type === 'number') value = (Math.random() * 4 + 1) * valueMultiplier;
    if (metricInfo.type === 'currency') value = (Math.random() * 15 + 5) * valueMultiplier;
    return {
      key: metricInfo.key,
      label: metricInfo.label,
      value: value,
      delta_pct: (Math.random() - 0.5) * 0.5,
      format: { type: metricInfo.type },
    };
  });

  const seriesData: OverviewApiResponse['series'] = {
    x: { type: 'time', key: 'date' },
    series: ALL_MOCK_METRIC_OPTIONS.map((metricInfo) => {
      const points: { date: string; channel: string; y: number }[] = [];
      let currentDay = new Date(start);
      while (currentDay <= end) {
        (filters.channels || []).forEach((channel) => {
          let yValue = (Math.random() * 70 + 20) * valueMultiplier;
          points.push({
            date: currentDay.toISOString().split('T')[0],
            channel: channel,
            y: yValue,
          });
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      return {
        key: metricInfo.key,
        label: metricInfo.label,
        points: points,
        format: { type: 'percent' },
      };
    }),
  };

  const tables: OverviewApiResponse['tables'] = [
    {
      title: 'By Channel',
      dimension: { key: 'channel', label: 'Channel' },
      columns: ALL_MOCK_METRIC_OPTIONS.map((metricInfo) => ({
        key: metricInfo.key,
        label: metricInfo.label,
        format: { type: metricInfo.type, precision: 1 },
      })),
      rows: (filters.channels || []).map((channel) => {
        const row: TableRowData = { channel };
        ALL_MOCK_METRIC_OPTIONS.forEach((metricInfo) => {
          let value = (Math.random() * 90 + 5) * valueMultiplier;
          row[metricInfo.key] = value;
        });
        return row;
      }),
    },
  ];

  return {
    meta: {
      tz: 'Asia/Bangkok',
      currency: 'THB',
      filters: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        channels: filters.channels,
        metrics: ALL_MOCK_METRIC_OPTIONS.map((m) => m.key),
        compare: 'prev_period',
        group_by: 'day',
        offer_ids: campaignOfferFilters.offer_ids,
      },
    },
    cards,
    series: seriesData,
    tables,
  };
};

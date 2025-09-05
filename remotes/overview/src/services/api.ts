import { AnalyticsOptions, OverviewApiResponse, FilterValues } from '../types';
import type { DateRange } from '@arcfusion/ui';

const API_BASE_URL = 'https://chat-with-data-336404645436.asia-southeast1.run.app/api/v1';

export const fetchAnalyticsOptions = async (): Promise<AnalyticsOptions> => {
  const response = await fetch(`${API_BASE_URL}/analytics/options`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics options');
  }
  return response.json();
};

export const fetchOverviewData = async (
  dateRange: DateRange,
  filters: FilterValues
): Promise<OverviewApiResponse> => {
  const params = new URLSearchParams();

  const startDate = dateRange.start
    ? dateRange.start.toISOString().split('T')[0]
    : '2025-07-15';
  const endDate = dateRange.end ? dateRange.end.toISOString().split('T')[0] : '2025-07-30';

  params.append('start', startDate);
  params.append('end', endDate);

  if (filters.channels.length > 0) {
    params.append('channels', filters.channels.join(','));
  }
  if (filters.metrics.length > 0) {
    params.append('metrics', filters.metrics.join(','));
  }

  params.append('compare', 'prev_period');

  const url = `${API_BASE_URL}/analytics/overview?${params.toString()}`;
  console.log('Fetching data from URL:', url);

  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown API error' }));
    throw new Error(`Failed to fetch overview data: ${errorData.detail || response.statusText}`);
  }
  return response.json();
};
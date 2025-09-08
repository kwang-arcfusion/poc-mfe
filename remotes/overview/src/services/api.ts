// remotes/overview/src/services/api.ts
import { AnalyticsOptions, OverviewApiResponse, FilterValues } from '../types';
import type { DateRange } from '@arcfusion/ui';

// Base URL for the analytics API
const API_BASE_URL = 'https://chat-with-data-336404645436.asia-southeast1.run.app/api/v1';

/**
 * Fetches the available filter options (dimensions and metrics) for the dashboard.
 * @returns {Promise<AnalyticsOptions>} A promise that resolves to the filter options.
 */
export const fetchAnalyticsOptions = async (): Promise<AnalyticsOptions> => {
  const response = await fetch(`${API_BASE_URL}/analytics/options`);
  if (!response.ok) {
    throw new Error('Failed to fetch analytics options');
  }
  return response.json();
};

/**
 * Fetches the main overview data based on selected filters and date range.
 * @param {DateRange} dateRange - The selected start and end dates.
 * @param {FilterValues} filters - The selected channel and metric filters.
 * @returns {Promise<OverviewApiResponse>} A promise that resolves to the dashboard data.
 */
export const fetchOverviewData = async (
  dateRange: DateRange,
  filters: FilterValues
): Promise<OverviewApiResponse> => {
  // Create a URLSearchParams object to build the query string
  const params = new URLSearchParams();

  // Set default dates if not provided
  const startDate = dateRange.start
    ? dateRange.start.toISOString().split('T')[0]
    : '2025-07-15';
  const endDate = dateRange.end ? dateRange.end.toISOString().split('T')[0] : '2025-07-30';

  params.append('start', startDate);
  params.append('end', endDate);

  // Append channels and metrics if they are not empty
  if (filters.channels.length > 0) {
    params.append('channels', filters.channels.join(','));
  }
  if (filters.metrics.length > 0) {
    params.append('metrics', filters.metrics.join(','));
  }

  // Add comparison parameter
  params.append('compare', 'prev_period');

  const url = `${API_BASE_URL}/analytics/overview?${params.toString()}`;
  console.log('Fetching data from URL:', url); // For debugging

  const response = await fetch(url);
  if (!response.ok) {
    // Attempt to parse error message from API response
    const errorData = await response.json().catch(() => ({ detail: 'Unknown API error' }));
    throw new Error(`Failed to fetch overview data: ${errorData.detail || response.statusText}`);
  }
  return response.json();
};
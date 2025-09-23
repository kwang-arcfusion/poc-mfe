// packages/client/src/client.ts
import type {
  PaginatedConversationsResponse,
  PaginatedStoriesResponse,
  Story,
  ConversationResponse,
  FeedbackRequest,
  FeedbackResponse,
  AnalyticsOptions,
  OverviewApiResponse,
  OptionGroup,
  DateRange,
} from '@arcfusion/types';

console.log('%c[client] Module Loaded', 'color: purple; font-weight: bold;');

let API_BASE_URL: string = '';

export function initApiClient(baseUrl: string) {
  if (!baseUrl) {
    throw new Error('API Base URL cannot be empty.');
  }
  API_BASE_URL = baseUrl;
  console.log(
    `%c[client] Initialized with URL: ${API_BASE_URL}`,
    'color: green; font-weight: bold;'
  );
}

export const getApiBaseUrl = (): string => {
  if (!API_BASE_URL) {
    console.error('[client] getApiBaseUrl called BEFORE initialization!');
  }
  return API_BASE_URL;
};

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  if (!API_BASE_URL) {
    throw new Error(
      'API Client has not been initialized. Please call initApiClient(baseUrl) first.'
    );
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorBody.detail || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// --- Stories API ---
export const getStories = (page = 1, pageSize = 20): Promise<PaginatedStoriesResponse> => {
  return apiFetch(`/v1/stories/?page=${page}&page_size=${pageSize}`);
};
export const getStoryById = (storyId: string): Promise<Story> => {
  return apiFetch(`/v1/stories/${storyId}`);
};

// --- Chat API ---
export const getConversations = (
  page = 1,
  pageSize = 20
): Promise<PaginatedConversationsResponse> => {
  return apiFetch(`/v1/chat/conversations?page=${page}&page_size=${pageSize}`);
};
export const getConversationByThreadId = (threadId: string): Promise<ConversationResponse> => {
  return apiFetch(`/v1/chat/conversations/${threadId}`);
};
export const getExportCsvUrl = (messageId: string): string => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return '';
  return `${baseUrl}/v1/chat/messages/${messageId}/export/csv`;
};

export const getExportPdfUrl = (messageId: string): string => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return '';
  return `${baseUrl}/v1/chat/messages/${messageId}/export/pdf`;
};

export const getStoryExportPdfUrl = (storyId: string): string => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return '';
  return `${baseUrl}/v1/stories/${storyId}/export/pdf`;
};

// --- Feedback API ---
export const submitFeedback = (feedbackData: FeedbackRequest): Promise<FeedbackResponse> => {
  return apiFetch(`/v1/feedback/`, { method: 'POST', body: JSON.stringify(feedbackData) });
};
export const deleteFeedback = (messageId: string): Promise<null> => {
  return apiFetch(`/v1/feedback/${messageId}`, { method: 'DELETE' });
};

// --- Analytics API Functions ---
const formatDateForApi = (date: Date | null) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export interface PaginatedSearchResponse {
  items: OptionGroup[];
  total: number;
  page: number;
  page_size: number;
}

export const searchCampaignsAndOffers = (
  dateRange: DateRange,
  query: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedSearchResponse> => {
  if (!dateRange.start || !dateRange.end) {
    return Promise.resolve({ items: [], total: 0, page: 1, page_size: pageSize });
  }

  const params = new URLSearchParams({
    start_date: formatDateForApi(dateRange.start),
    end_date: formatDateForApi(dateRange.end),
    page: String(page),
    page_size: String(pageSize),
  });
  if (query) {
    params.append('query', query);
  }
  return apiFetch(`/v1/analytics/search?${params.toString()}`);
};

export const fetchAnalyticsOptions = (): Promise<AnalyticsOptions> => {
  return apiFetch('/v1/analytics/options');
};

export const fetchCampaignOffersByDate = (dateRange: DateRange): Promise<OptionGroup[]> => {
  const params = new URLSearchParams({
    start_date: formatDateForApi(dateRange.start),
    end_date: formatDateForApi(dateRange.end),
  });
  return apiFetch(`/v1/analytics/filters/campaign-offers?${params.toString()}`);
};

export const fetchPerformanceSummary = (filters: {
  dateRange: DateRange;
  offer_ids?: string[];
}): Promise<any[]> => {
  const params = new URLSearchParams({
    start_date: formatDateForApi(filters.dateRange.start),
    end_date: formatDateForApi(filters.dateRange.end),
  });
  if (filters.offer_ids && filters.offer_ids.length > 0) {
    filters.offer_ids.forEach((filter) => params.append('filter', filter));
  }
  return apiFetch(`/v1/analytics/performance-summary?${params.toString()}`);
};

export const fetchOverviewData = (
  dateRange: DateRange,
  channels: string[],
  offerFilters: string[],
  compare?: string
): Promise<OverviewApiResponse> => {
  const params = new URLSearchParams({
    start: formatDateForApi(dateRange.start),
    end: formatDateForApi(dateRange.end),
    channels: channels.join(','),
  });
  if (offerFilters.length > 0) {
    offerFilters.forEach((filter) => params.append('filter', filter));
  }
  if (compare) {
    params.append('compare', compare);
  }
  return apiFetch(`/v1/analytics/overview?${params.toString()}`);
};

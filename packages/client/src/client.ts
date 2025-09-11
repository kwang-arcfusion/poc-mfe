// packages/client/src/client.ts
import type {
  PaginatedConversationsResponse,
  PaginatedStoriesResponse,
  Story,
  ConversationResponse,
  FeedbackRequest,
  FeedbackResponse,
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

// --- Feedback API ---
export const submitFeedback = (feedbackData: FeedbackRequest): Promise<FeedbackResponse> => {
  return apiFetch(`/v1/feedback/`, {
    method: 'POST',
    body: JSON.stringify(feedbackData),
  });
};

export const deleteFeedback = (messageId: string): Promise<null> => {
  return apiFetch(`/v1/feedback/${messageId}`, {
    method: 'DELETE',
  });
};

/**
 * Constructs the URL to download the SQL result of a message as a CSV file.
 * @param messageId - The ID of the message.
 * @returns The full URL for the CSV export endpoint.
 */
export const getExportCsvUrl = (messageId: string): string => {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) {
    console.error('API Client has not been initialized. Cannot create export URL.');
    return '';
  }
  return `${baseUrl}/v1/chat/messages/${messageId}/export/csv`;
};

// packages/client/src/client.ts
import type {
  PaginatedConversationsResponse,
  PaginatedStoriesResponse,
  Story,
} from '@arcfusion/types';
console.log('%c[client] Module Loaded', 'color: purple; font-weight: bold;');

let API_BASE_URL: string = '';

export function initApiClient(baseUrl: string) {
  if (!baseUrl) {
    throw new Error('API Base URL cannot be empty.');
  }
  API_BASE_URL = baseUrl;
  // ✨ เพิ่ม Log ตรงนี้ ✨
  console.log(
    `%c[client] Initialized with URL: ${API_BASE_URL}`,
    'color: green; font-weight: bold;'
  );
}

export const getApiBaseUrl = (): string => {
  // ✨ เพิ่ม Log ตรงนี้ ✨
  if (!API_BASE_URL) {
    console.error('[client] getApiBaseUrl called BEFORE initialization!');
  }
  return API_BASE_URL;
};
/**
 * ฟังก์ชันกลางสำหรับเรียก fetch API
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // 2. เพิ่มเงื่อนไขเช็คว่า initApiClient ถูกเรียกแล้วหรือยัง
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

// --- ส่วนที่เหลือของฟังก์ชันเหมือนเดิม ---
export const getStories = (page = 1, pageSize = 20): Promise<PaginatedStoriesResponse> => {
  return apiFetch(`/v1/stories?page=${page}&page_size=${pageSize}`);
};

export const getStoryById = (storyId: string): Promise<Story> => {
  return apiFetch(`/v1/stories/${storyId}`);
};

export const getConversations = (
  page = 1,
  pageSize = 20
): Promise<PaginatedConversationsResponse> => {
  return apiFetch(`/v1/chat/conversations?page=${page}&page_size=${pageSize}`);
};

export const getConversationByThreadId = (threadId: string) => {
  return apiFetch(`/v1/chat/conversations/${threadId}`);
};

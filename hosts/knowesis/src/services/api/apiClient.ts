// hosts/knowesis/src/services/api/apiClient.ts
import type { PaginatedConversationsResponse, PaginatedStoriesResponse, Story } from './types';

// ดึงค่า URL จาก Environment Variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('REACT_APP_API_BASE_URL is not defined. Please check your .env file.');
}

/**
 * ฟังก์ชันกลางสำหรับเรียก fetch API
 * - ตั้งค่า Header พื้นฐาน
 * - จัดการ Error แบบพื้นฐาน
 * - (ในอนาคต) จะเป็นที่สำหรับใส่ Authentication Token
 */
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}` // จะมาเพิ่มใน Phase 5
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(errorBody.detail || `API request failed with status ${response.status}`);
  }

  // สำหรับ endpoint ที่ไม่มี response body (เช่น DELETE)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// --- Stories API ---
export const getStories = (page = 1, pageSize = 20): Promise<PaginatedStoriesResponse> => {
  return apiFetch(`/v1/stories?page=${page}&page_size=${pageSize}`);
};

export const getStoryById = (storyId: string): Promise<Story> => {
  return apiFetch(`/v1/stories/${storyId}`);
};

// --- Conversations API ---
export const getConversations = (
  page = 1,
  pageSize = 20
): Promise<PaginatedConversationsResponse> => {
  return apiFetch(`/v1/chat/conversations?page=${page}&page_size=${pageSize}`);
};

export const getConversationByThreadId = (threadId: string) => {
  // TODO: เพิ่ม Type ที่ถูกต้องสำหรับ ConversationDetail
  return apiFetch(`/v1/chat/conversations/${threadId}`);
};

// --- Feedback API ---
// TODO: สร้าง function สำหรับ POST และ DELETE feedback

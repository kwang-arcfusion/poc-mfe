// packages/store/src/chatHistoryStore.ts
import { create } from 'zustand';
import { getConversations } from '@arcfusion/client';
import type { ConversationSummary } from '@arcfusion/types';

export type ChatHistoryTab = 'ask' | 'story';

export interface UnreadResponseInfo {
  threadId: string;
  storyId?: string | null;
  title: string;
}

export interface ChatHistoryState {
  conversations: ConversationSummary[];
  askConversations: ConversationSummary[];
  storyConversations: ConversationSummary[];
  isLoading: boolean;
  isPopoverOpen: boolean;
  activeTab: ChatHistoryTab;
  // ✨ [แก้ไข] เปลี่ยนจากตัวแปรเดี่ยวเป็น Object เพื่อเก็บสถานะของหลายแชท
  streamingTasks: Record<string, string>; // e.g., { [threadId]: 'thinking' }
  unreadResponses: UnreadResponseInfo[];
  fetchConversations: () => Promise<void>;
  togglePopover: () => void;
  closePopover: () => void;
  setActiveTab: (tab: ChatHistoryTab) => void;
  // ✨ [แก้ไข] สร้าง Actions ใหม่สำหรับจัดการสถานะ
  startStreaming: (threadId: string, task: string) => void;
  stopStreaming: (threadId: string) => void;
  addUnreadResponse: (info: UnreadResponseInfo) => void;
  removeUnreadResponse: (threadId: string) => void;
  addOptimisticConversation: (
    newConvo: Partial<ConversationSummary> & { title: string; thread_id: string }
  ) => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set, get) => ({
  conversations: [],
  askConversations: [],
  storyConversations: [],
  isLoading: false,
  isPopoverOpen: false,
  activeTab: 'ask',
  // ✨ [แก้ไข] ค่าเริ่มต้นเป็น Object ว่าง
  streamingTasks: {},
  unreadResponses: [],

  fetchConversations: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const response = await getConversations(1, 100);
      const askItems = response.items.filter((c) => !c.story_id);
      const storyItems = response.items.filter((c) => !!c.story_id);

      set({
        conversations: response.items,
        askConversations: askItems,
        storyConversations: storyItems,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      set({ isLoading: false });
    }
  },

  togglePopover: () => {
    set((state) => ({
      isPopoverOpen: !state.isPopoverOpen,
    }));
  },

  closePopover: () => {
    set({ isPopoverOpen: false });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  // ✨ [แก้ไข] Action สำหรับเริ่มหรืออัปเดตสถานะของแชท
  startStreaming: (threadId, task) =>
    set((state) => ({
      streamingTasks: {
        ...state.streamingTasks,
        [threadId]: task,
      },
    })),

  // ✨ [แก้ไข] Action สำหรับลบสถานะของแชทเมื่อจบการทำงาน
  stopStreaming: (threadId) =>
    set((state) => {
      const newStreamingTasks = { ...state.streamingTasks };
      delete newStreamingTasks[threadId];
      return { streamingTasks: newStreamingTasks };
    }),

  addUnreadResponse: (info) =>
    set((state) => {
      if (state.unreadResponses.some((r) => r.threadId === info.threadId)) {
        return state;
      }
      return { unreadResponses: [...state.unreadResponses, info] };
    }),

  removeUnreadResponse: (threadId) =>
    set((state) => ({
      unreadResponses: state.unreadResponses.filter((r) => r.threadId !== threadId),
    })),

  addOptimisticConversation: (newConvo) =>
    set((state) => {
      const optimisticConvo: ConversationSummary = {
        id: newConvo.thread_id,
        user_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...newConvo,
      };

      if (state.conversations.some((c) => c.thread_id === optimisticConvo.thread_id)) {
        return state;
      }

      const isStoryChat = !!newConvo.story_id;
      const newAskConversations = isStoryChat
        ? state.askConversations
        : [optimisticConvo, ...state.askConversations];
      const newStoryConversations = isStoryChat
        ? [optimisticConvo, ...state.storyConversations]
        : state.storyConversations;

      return {
        conversations: [optimisticConvo, ...state.conversations],
        askConversations: newAskConversations,
        storyConversations: newStoryConversations,
      };
    }),
}));

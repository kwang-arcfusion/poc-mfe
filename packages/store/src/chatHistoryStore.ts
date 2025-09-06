// packages/store/src/chatHistoryStore.ts
import { create } from 'zustand';
import { getConversations } from '@arcfusion/client';
import type { ConversationSummary } from '@arcfusion/types';

export type ChatHistoryTab = 'ask' | 'story';

export interface ChatHistoryState {
  conversations: ConversationSummary[];
  askConversations: ConversationSummary[];
  storyConversations: ConversationSummary[];
  isLoading: boolean;
  isPopoverOpen: boolean;
  activeTab: ChatHistoryTab;
  streamingThreadId: string | null; // ID ของแชทที่กำลัง stream
  streamingTask: string | null; // Task ปัจจุบันของแชทที่กำลัง stream
  fetchConversations: () => Promise<void>;
  togglePopover: () => void;
  closePopover: () => void;
  setActiveTab: (tab: ChatHistoryTab) => void;
  setStreamingThreadId: (id: string | null) => void; // Action สำหรับอัปเดต ID
  setStreamingTask: (task: string | null) => void; // Action สำหรับอัปเดต Task
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
  streamingThreadId: null,
  streamingTask: null,

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
    set((state) => ({ isPopoverOpen: !state.isPopoverOpen }));
  },

  closePopover: () => {
    set({ isPopoverOpen: false });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setStreamingThreadId: (id) => set({ streamingThreadId: id }),
  setStreamingTask: (task) => set({ streamingTask: task }),

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
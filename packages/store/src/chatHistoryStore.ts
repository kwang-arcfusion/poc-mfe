// packages/store/src/chatHistoryStore.ts
import { create } from 'zustand';
import { getConversations } from '@arcfusion/client';
import type { ConversationSummary } from '@arcfusion/types';

// ✨ 1. กำหนด Type ของ Tab ที่จะใช้
export type ChatHistoryTab = 'ask' | 'story';

export interface ChatHistoryState {
  conversations: ConversationSummary[]; // ✨ 2. เพิ่ม State สำหรับเก็บรายการที่กรองแล้ว
  askConversations: ConversationSummary[];
  storyConversations: ConversationSummary[];
  isLoading: boolean;
  isPopoverOpen: boolean; // ✨ 3. เพิ่ม State สำหรับ Tab ปัจจุบัน
  activeTab: ChatHistoryTab;
  fetchConversations: () => Promise<void>;
  togglePopover: () => void;
  closePopover: () => void; // ✨ 4. เพิ่ม Action สำหรับเปลี่ยน Tab
  setActiveTab: (tab: ChatHistoryTab) => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set, get) => ({
  conversations: [], // ✨ 5. กำหนดค่าเริ่มต้น
  askConversations: [],
  storyConversations: [],
  isLoading: false,
  isPopoverOpen: false,
  activeTab: 'ask',

  fetchConversations: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const response = await getConversations(1, 100); // ดึงสูงสุด 100 รายการ
      // ✨ 6. กรองข้อมูลและจัดเก็บลง State ที่แยกกัน
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
  }, // ✨ 7. Implement Action สำหรับเปลี่ยน Tab

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
}));

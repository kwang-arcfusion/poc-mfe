// packages/store/src/chatHistoryStore.ts
import { create } from 'zustand';
import { getConversations, type ConversationSummary } from '@arcfusion/client';

export interface ChatHistoryState {
  conversations: ConversationSummary[];
  isLoading: boolean;
  isPopoverOpen: boolean;
  fetchConversations: () => Promise<void>;
  togglePopover: () => void;
  closePopover: () => void;
}

export const useChatHistoryStore = create<ChatHistoryState>((set, get) => ({
  conversations: [],
  isLoading: false,
  isPopoverOpen: false,

  // Action สำหรับดึงข้อมูลประวัติการแชทจาก API
  fetchConversations: async () => {
    if (get().isLoading) return; // ป้องกันการยิง API ซ้ำซ้อน
    set({ isLoading: true });
    try {
      const response = await getConversations(1, 50); // ดึงหน้า 1, สูงสุด 50 รายการ
      set({ conversations: response.items, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      set({ isLoading: false });
    }
  },

  // Action สำหรับ เปิด/ปิด Popover
  togglePopover: () => {
    set((state) => ({ isPopoverOpen: !state.isPopoverOpen }));
  },

  // Action สำหรับปิด Popover (เผื่อใช้จากที่อื่น)
  closePopover: () => {
    set({ isPopoverOpen: false });
  },
}));

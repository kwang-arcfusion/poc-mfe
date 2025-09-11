// packages/store/src/typingEffectStore.ts
import { create } from 'zustand';

export interface TypingEffectState {
  // ใช้ Set เพื่อประสิทธิภาพในการเพิ่ม, ลบ, และค้นหา O(1)
  typingMessageIds: Set<string>;
  startTyping: (messageId: string) => void;
  stopTyping: (messageId: string) => void;
}

export const useTypingEffectStore = create<TypingEffectState>((set) => ({
  typingMessageIds: new Set(),
  startTyping: (messageId) =>
    set((state) => ({
      typingMessageIds: new Set(state.typingMessageIds).add(messageId),
    })),
  stopTyping: (messageId) =>
    set((state) => {
      const newSet = new Set(state.typingMessageIds);
      newSet.delete(messageId);
      return { typingMessageIds: newSet };
    }),
}));
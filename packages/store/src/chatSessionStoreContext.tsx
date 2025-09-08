// packages/store/src/chatSessionStoreContext.tsx
import React, { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createChatSessionStore, type ChatSessionState } from './chatSessionStore';

// 1. สร้าง Store Type สำหรับ Context
type ChatSessionStore = ReturnType<typeof createChatSessionStore>;

// 2. สร้าง React Context
const ChatSessionContext = createContext<ChatSessionStore | null>(null);

// 3. สร้าง Provider Component
export function ChatSessionProvider({ children }: { children: React.ReactNode }) {
  // ใช้ useRef เพื่อให้ store ถูกสร้างแค่ครั้งเดียวต่อ Provider instance
  const storeRef = useRef<ChatSessionStore>();
  if (!storeRef.current) {
    storeRef.current = createChatSessionStore();
  }

  return (
    <ChatSessionContext.Provider value={storeRef.current}>{children}</ChatSessionContext.Provider>
  );
}

// 4. สร้าง Custom Hook สำหรับเลือก state จาก Context
export function useChatSession<T>(selector: (state: ChatSessionState) => T): T {
  const store = useContext(ChatSessionContext);
  if (!store) {
    throw new Error('useChatSession must be used within a ChatSessionProvider');
  }
  return useStore(store, selector);
}

// 5. สร้าง Hook สำหรับเข้าถึง store API (actions, etc.)
export function useChatSessionStoreApi() {
  const store = useContext(ChatSessionContext);
  if (!store) {
    throw new Error('useChatSessionStoreApi must be used within a ChatSessionProvider');
  }
  return store;
}

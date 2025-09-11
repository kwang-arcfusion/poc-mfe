// packages/store/src/chatSessionStoreContext.tsx
import React, { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createChatSessionStore, type ChatSessionState } from './chatSessionStore';

type ChatSessionStore = ReturnType<typeof createChatSessionStore>;

const ChatSessionContext = createContext<ChatSessionStore | null>(null);

export function ChatSessionProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<ChatSessionStore>();
  if (!storeRef.current) {
    storeRef.current = createChatSessionStore();
  }

  return (
    <ChatSessionContext.Provider value={storeRef.current}>{children}</ChatSessionContext.Provider>
  );
}

export function useChatSession<T>(selector: (state: ChatSessionState) => T): T {
  const store = useContext(ChatSessionContext);
  if (!store) {
    throw new Error('useChatSession must be used within a ChatSessionProvider');
  }
  return useStore(store, selector);
}

export function useChatSessionStoreApi() {
  const store = useContext(ChatSessionContext);
  if (!store) {
    throw new Error('useChatSessionStoreApi must be used within a ChatSessionProvider');
  }
  return store;
}

// remotes/ask_ai/src/AskAi.tsx
import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@fluentui/react-components';
import {
  useChatSession,
  useChatSessionStoreApi,
  useChatHistoryStore,
} from '@arcfusion/store';
import { InitialView, ChatLog, ChatInputBar } from '@arcfusion/ui';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
});

interface AskAiProps {
  navigate: (path: string, options?: { replace?: boolean }) => void;
  chatId?: string;
}

export default function AskAi({ navigate, chatId }: AskAiProps) {
  const styles = useStyles();
  const isMountedRef = useRef(true);

  const blocks = useChatSession((state) => state.blocks);
  const status = useChatSession((state) => state.status);
  const currentAiTask = useChatSession((state) => state.currentAiTask);
  const threadId = useChatSession((state) => state.threadId);
  const streamingThreadId = useChatSession((state) => state.streamingThreadId);

  const storeApi = useChatSessionStoreApi();
  const { fetchConversations: refreshHistory, setUnreadResponseInfo } = useChatHistoryStore();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const { loadConversation, clearChat } = storeApi.getState();
    if (chatId && chatId !== threadId) {
      loadConversation(chatId);
    } else if (!chatId && threadId && status !== 'streaming') {
      clearChat();
    }
  }, [chatId, threadId, status, storeApi]);

  const isCurrentChatStreaming = status === 'streaming' && threadId === streamingThreadId;

  const handleSendMessage = (text: string) => {
    const { sendMessage, updateLastMessageWithData, threadId: currentThreadId } = storeApi.getState();

    sendMessage(text, currentThreadId).then((newThreadId) => {
      if (isMountedRef.current && !currentThreadId && newThreadId) {
        navigate(`/ask_ai/${newThreadId}`, { replace: true });
        refreshHistory();
      }
      
      if (newThreadId) {
        updateLastMessageWithData(newThreadId);
        
        // ✨ เปลี่ยนไปเรียก setUnreadResponseInfo แทน
        if (!isMountedRef.current) {
          setUnreadResponseInfo({
            threadId: newThreadId,
            title: text, // ส่ง title ไปด้วย
            storyId: null // ไม่มี storyId ในหน้านี้
          });
        }
      }
    });
  };

  return (
    <div className={styles.root}>
      {blocks.length === 0 && !isCurrentChatStreaming ? (
        <InitialView onSuggestionClick={handleSendMessage} />
      ) : (
        <ChatLog
          blocks={blocks}
          status={isCurrentChatStreaming ? 'streaming' : 'idle'}
          currentAiTask={isCurrentChatStreaming ? currentAiTask : null}
        />
      )}
      <ChatInputBar onSendMessage={handleSendMessage} isStreaming={isCurrentChatStreaming} />
    </div>
  );
}
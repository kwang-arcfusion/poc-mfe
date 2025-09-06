// remotes/ask_ai/src/AskAi.tsx
import React, { useEffect } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { useChatSessionStore, useChatHistoryStore } from '@arcfusion/store';
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
  const {
    blocks,
    status,
    currentAiTask,
    threadId,
    streamingThreadId,
    loadConversation,
    sendMessage: sendMessageFromStore,
    clearChat,
    updateLastMessageWithData,
  } = useChatSessionStore();
  const { fetchConversations: refreshHistory } = useChatHistoryStore();

  useEffect(() => {
    if (chatId && chatId !== threadId) {
      loadConversation(chatId);
    } else if (!chatId && threadId && status !== 'streaming') {
      clearChat();
    }
  }, [chatId, threadId, status, loadConversation, clearChat]);

  // ✨ ================== START: แก้ไขส่วนนี้ ================== ✨
  // เปลี่ยนไปเปรียบเทียบ threadId จาก store กับ streamingThreadId โดยตรง
  // เพราะ threadId ใน store คือ "สิ่งที่ UI กำลังแสดงผลอยู่" ที่ถูกต้องที่สุด
  const isCurrentChatStreaming = status === 'streaming' && threadId === streamingThreadId;
  // ✨ =================== END: แก้ไขส่วนนี้ =================== ✨

  const handleSendMessage = (text: string) => {
    const currentThreadId = useChatSessionStore.getState().threadId;

    sendMessageFromStore(text, currentThreadId).then((newThreadId) => {
      if (!currentThreadId && newThreadId) {
        navigate(`/ask_ai/${newThreadId}`, { replace: true });
        refreshHistory();
      }
      if (newThreadId) {
        updateLastMessageWithData(newThreadId);
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

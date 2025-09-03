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
    status, // <--- 1. ดึง status มาใช้งาน
    currentAiTask,
    threadId,
    loadConversation,
    sendMessage: sendMessageFromStore,
    clearChat,
    updateLastMessageWithData,
  } = useChatSessionStore();
  const { fetchConversations: refreshHistory } = useChatHistoryStore();

  const isStreaming = status === 'streaming';

  // 👇 2. แก้ไข useEffect ทั้งหมดที่นี่
  useEffect(() => {
    // ถ้ากำลัง stream อยู่ ไม่ต้องทำอะไรทั้งสิ้น ปล่อยให้ stream ทำงานไป
    if (status === 'streaming') {
      return;
    }

    // ถ้า URL มี chatId และไม่ตรงกับ threadId ใน store ให้โหลดข้อมูลแชทนั้น
    if (chatId && chatId !== threadId) {
      loadConversation(chatId);
    }
    // ถ้า URL ไม่มี chatId แต่ใน store ยังมี threadId ของแชทเก่าค้างอยู่ ให้ล้างข้อมูล
    else if (!chatId && threadId) {
      clearChat();
    }
  }, [chatId, threadId, status, loadConversation, clearChat]); // <--- 3. เพิ่ม status ใน dependency array

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
      {blocks.length === 0 && !isStreaming ? (
        <InitialView onSuggestionClick={handleSendMessage} />
      ) : (
        <ChatLog blocks={blocks} status={status} currentAiTask={currentAiTask} />
      )}
      <ChatInputBar onSendMessage={handleSendMessage} isStreaming={isStreaming} />
    </div>
  );
}

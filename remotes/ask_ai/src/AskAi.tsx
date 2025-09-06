// remotes/ask_ai/src/AskAi.tsx
import React, { useEffect, useRef } from 'react'; // ✨ 1. Import useRef และ useEffect
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

// ✨ 2. ลบ location prop ออกจาก Interface
interface AskAiProps {
  navigate: (path: string, options?: { replace?: boolean }) => void;
  chatId?: string;
}

// ✨ 3. ลบ location ออกจาก props ที่รับเข้ามา
export default function AskAi({ navigate, chatId }: AskAiProps) {
  const styles = useStyles();
  // ✨ 4. สร้าง ref เพื่อติดตามสถานะ mount ของ component
  const isMountedRef = useRef(true);

  const blocks = useChatSession((state) => state.blocks);
  const status = useChatSession((state) => state.status);
  const currentAiTask = useChatSession((state) => state.currentAiTask);
  const threadId = useChatSession((state) => state.threadId);
  const streamingThreadId = useChatSession((state) => state.streamingThreadId);

  const storeApi = useChatSessionStoreApi();
  const { fetchConversations: refreshHistory } = useChatHistoryStore();

  // ✨ 5. ใช้ useEffect เพื่ออัปเดต ref เมื่อ component ถูก unmount
  useEffect(() => {
    isMountedRef.current = true; // ตั้งเป็น true เมื่อ component mount
    // ฟังก์ชัน cleanup นี้จะทำงานเมื่อ component ถูก unmount ออกจากหน้าจอ
    return () => {
      isMountedRef.current = false;
    };
  }, []); // dependency array ว่างเปล่าเพื่อให้ทำงานแค่ตอน mount และ unmount

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
      // ✨ 6. เปลี่ยนเงื่อนไขมาเช็ค ref แทน location
      // "ถ้าแชทนี้เป็นการแชทใหม่ และ component ยังคงแสดงผลอยู่ ให้ navigate"
      if (isMountedRef.current && !currentThreadId && newThreadId) {
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
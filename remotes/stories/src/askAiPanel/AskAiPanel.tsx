// remotes/stories/src/askAiPanel/AskAiPanel.tsx
import React, { useEffect } from 'react';
import { makeStyles, tokens, shorthands, Button, Text } from '@fluentui/react-components';
import { Dismiss24Regular, Sparkle24Filled } from '@fluentui/react-icons';
import { useChatSessionStore, useChatHistoryStore } from '@arcfusion/store';
import type { Story } from '@arcfusion/types';
import { ChatLog, ChatInputBar } from '@arcfusion/ui';

// ... (โค้ด styles เหมือนเดิม) ...
const useStyles = makeStyles({
  panelRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    flexShrink: 0,
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    color: tokens.colorBrandForeground1,
  },
});

// ✨ 1. เพิ่ม threadId ใน Props
interface AskAiPanelProps {
  story: Story;
  onClose: () => void;
  threadId?: string;
}

export function AskAiPanel({ story, onClose, threadId }: AskAiPanelProps) {
  const styles = useStyles();
  const {
    blocks,
    status,
    currentAiTask, // ✨ 2. ดึง threadId ปัจจุบันใน store มาเพื่อเปรียบเทียบ
    threadId: currentThreadId,
    sendMessage: sendMessageFromStore,
    clearChat,
    updateLastMessageWithData, // ✨ 3. ดึง loadConversation มาใช้งาน
    loadConversation,
  } = useChatSessionStore();
  const { fetchConversations: refreshHistory } = useChatHistoryStore();

  const isStreaming = status === 'streaming'; // ✨ 4. แก้ไข Logic การทำงานของ useEffect ทั้งหมด

  useEffect(() => {
    if (threadId) {
      // ถ้ามี threadId จาก prop (เช่น มาจาก URL) ให้โหลดประวัติแชทนั้น
      // เช็คก่อนว่า thread ที่จะโหลดไม่ตรงกับที่อยู่ใน store แล้ว เพื่อป้องกันการโหลดซ้ำ
      if (currentThreadId !== threadId) {
        loadConversation(threadId);
      }
    } else {
      // ถ้าไม่มี threadId (เช่น ผู้ใช้กดปุ่ม 'Ask AI' เพื่อเริ่มแชทใหม่) ให้ล้างแชทเก่าทิ้ง
      clearChat();
    } // เพิ่ม dependencies ให้ครบถ้วน
  }, [threadId, currentThreadId, loadConversation, clearChat]);

  const handleSendMessage = (text: string) => {
    // ใช้ threadId จาก prop ถ้ามี, หรือจาก store ถ้าไม่มี (กรณีแชทต่อเนื่อง)
    const conversationThreadId = threadId || currentThreadId;

    sendMessageFromStore(text, conversationThreadId, story.id).then((newThreadId) => {
      if (!conversationThreadId && newThreadId) {
        refreshHistory();
      }
      if (newThreadId) {
        updateLastMessageWithData(newThreadId);
      }
    });
  };

  return (
    <div className={styles.panelRoot}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Sparkle24Filled /> <Text weight="semibold">Ask about this Story</Text>
        </div>

        <Button
          appearance="transparent"
          icon={<Dismiss24Regular />}
          onClick={onClose}
          aria-label="Close"
        />
      </div>
      <ChatLog blocks={blocks} status={status} currentAiTask={currentAiTask} />
      <ChatInputBar onSendMessage={handleSendMessage} isStreaming={isStreaming} />
    </div>
  );
}

// remotes/stories/src/askAiPanel/AskAiPanel.tsx
import React, { useEffect } from 'react';
import { makeStyles, tokens, shorthands, Button, Text } from '@fluentui/react-components';
import { Dismiss24Regular, Sparkle24Filled } from '@fluentui/react-icons';
import { useChatSessionStore, useChatHistoryStore } from '@arcfusion/store';
import type { Story } from '@arcfusion/types';
import { ChatLog, ChatInputBar } from '@arcfusion/ui';

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
    currentAiTask,
    threadId: currentThreadId,
    sendMessage: sendMessageFromStore,
    clearChat,
    updateLastMessageWithData,
    loadConversation,
  } = useChatSessionStore();
  const { fetchConversations: refreshHistory } = useChatHistoryStore();

  const isStreaming = status === 'streaming'; // ✨ FIX: แก้ไข useEffect และ dependency array

  useEffect(() => {
    // Logic นี้จะทำงานแค่ครั้งเดียวเมื่อ component ถูก mount
    // หรือเมื่อ `threadId` ที่เป็น prop เปลี่ยนไปเท่านั้น
    if (threadId) {
      // ถ้ามี threadId จาก prop (เช่น มาจาก URL) ให้โหลดประวัติแชทนั้น
      loadConversation(threadId);
    } else {
      // ถ้าไม่มี threadId (ผู้ใช้กดปุ่ม 'Ask AI' เพื่อเริ่มแชทใหม่) ให้ล้างแชทเก่าทิ้ง
      clearChat();
    } // การเอา currentThreadId ออกจาก dependency array เป็นการป้องกันไม่ให้ effect นี้ทำงานซ้ำ
    // ทุกครั้งที่ state ภายใน session เปลี่ยนแปลง
  }, [threadId, loadConversation, clearChat]);

  const handleSendMessage = (text: string) => {
    // Logic ตรงนี้ถูกต้องแล้ว มันจะใช้ threadId จาก store ที่อัปเดตล่าสุดเสมอ
    const conversationThreadId = currentThreadId;

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

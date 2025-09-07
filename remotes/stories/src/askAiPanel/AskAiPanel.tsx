// remotes/stories/src/askAiPanel/AskAiPanel.tsx
import React, { useEffect, useRef } from 'react';
import { makeStyles, tokens, shorthands, Button, Text } from '@fluentui/react-components';
import { Dismiss24Regular, Sparkle24Filled } from '@fluentui/react-icons';
// ❌ ลบ import useNavigate ออก
import {
  useChatSession,
  useChatSessionStoreApi,
  useChatHistoryStore,
} from '@arcfusion/store';
import type { Story } from '@arcfusion/types';
import { ChatLog, ChatInputBar } from '@arcfusion/ui';

const useStyles = makeStyles({
  // ... (styles ทั้งหมดเหมือนเดิม ไม่ต้องแก้ไข)
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

// ✨ 1. เพิ่ม navigate เข้าไปใน Props Interface
interface AskAiPanelProps {
  story: Story;
  onClose: () => void;
  threadId?: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
}

// ✨ 2. รับ navigate เข้ามาเป็น prop
export function AskAiPanel({ story, onClose, threadId: initialThreadId, navigate }: AskAiPanelProps) {
  const styles = useStyles();
  const isMountedRef = useRef(true);
  // ❌ ลบ const navigate = useNavigate() ออก

  const blocks = useChatSession((state) => state.blocks);
  const status = useChatSession((state) => state.status);
  const currentAiTask = useChatSession((state) => state.currentAiTask);

  const storeApi = useChatSessionStoreApi();
  const {
    fetchConversations: refreshHistory,
    addUnreadResponse,
    removeUnreadResponse,
    unreadResponses,
  } = useChatHistoryStore();

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (initialThreadId && unreadResponses.some((r) => r.threadId === initialThreadId)) {
      removeUnreadResponse(initialThreadId);
    }
  }, [initialThreadId, unreadResponses, removeUnreadResponse]);

  useEffect(() => {
    const { loadConversation, clearChat } = storeApi.getState();
    const currentStoreThreadId = storeApi.getState().threadId;

    if (initialThreadId) {
      if (initialThreadId !== currentStoreThreadId) {
        loadConversation(initialThreadId);
      }
    } else {
      if (status !== 'streaming') {
        clearChat();
      }
    }
  }, [initialThreadId, status, storeApi]);

  const isCurrentChatStreaming = status === 'streaming';

  const handleSendMessage = (text: string) => {
    const { sendMessage, updateLastMessageWithData, threadId: conversationThreadId } = storeApi.getState();

    sendMessage(text, conversationThreadId, story.id).then((newThreadId) => {
      // ✨ 3. ใช้ navigate ที่รับมาจาก prop
      if (isMountedRef.current && !conversationThreadId && newThreadId) {
        navigate(`/stories/${story.id}?thread=${newThreadId}`, { replace: true });
        refreshHistory();
      }

      if (newThreadId) {
        updateLastMessageWithData(newThreadId);

        if (!isMountedRef.current) {
          addUnreadResponse({
            threadId: newThreadId,
            title: text,
            storyId: story.id,
          });
        }
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
      <ChatLog
        blocks={blocks}
        status={isCurrentChatStreaming ? 'streaming' : 'idle'}
        currentAiTask={isCurrentChatStreaming ? currentAiTask : null}
      />
      <ChatInputBar onSendMessage={handleSendMessage} isStreaming={isCurrentChatStreaming} />
    </div>
  );
}
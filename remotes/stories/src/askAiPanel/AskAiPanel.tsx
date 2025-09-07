// remotes/stories/src/askAiPanel/AskAiPanel.tsx
import React, { useEffect, useRef } from 'react';
import { makeStyles, tokens, shorthands, Button, Text } from '@fluentui/react-components';
import { Dismiss24Regular, Sparkle24Filled } from '@fluentui/react-icons';
import {
  useChatSession,
  useChatSessionStoreApi,
  useChatHistoryStore,
} from '@arcfusion/store';
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

export function AskAiPanel({ story, onClose, threadId: initialThreadId }: AskAiPanelProps) {
  const styles = useStyles();
  const isMountedRef = useRef(true);

  const blocks = useChatSession((state) => state.blocks);
  const status = useChatSession((state) => state.status);
  const currentAiTask = useChatSession((state) => state.currentAiTask);
  const currentThreadId = useChatSession((state) => state.threadId);

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
  
  // ✨ [Best Practice] 6. ใช้ Logic เดียวกันกับ AskAiPage
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
      if (!conversationThreadId && newThreadId) {
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
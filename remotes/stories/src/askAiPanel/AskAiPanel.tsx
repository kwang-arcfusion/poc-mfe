// remotes/stories/src/askAiPanel/AskAiPanel.tsx
import React, { useEffect, useRef } from 'react';
import { makeStyles, tokens, shorthands, Button, Text } from '@fluentui/react-components';
import { Dismiss24Regular, Sparkle24Filled, Sparkle48Filled } from '@fluentui/react-icons';
import { useChatSession, useChatSessionStoreApi, useChatHistoryStore } from '@arcfusion/store';
import type { Story } from '@arcfusion/types';
import { ChatLog, ChatInputBar, InitialView } from '@arcfusion/ui';

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
  contentArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

interface AskAiPanelProps {
  story: Story;
  onClose: () => void;
  threadId?: string;
  navigate: (path: string, options?: { replace?: boolean }) => void;
}

const STORY_CONVERSATION_STARTERS = [
  'Summarize the key insight for me.',
  'What are the recommended actions?',
];

export function AskAiPanel({
  story,
  onClose,
  threadId: initialThreadId,
  navigate,
}: AskAiPanelProps) {
  const styles = useStyles();
  const isMountedRef = useRef(true);

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
    const {
      sendMessage,
      updateLastMessageWithData,
      threadId: conversationThreadId,
    } = storeApi.getState();

    sendMessage(text, conversationThreadId, story.id).then((newThreadId) => {
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
          <Sparkle24Filled /> <Text weight="semibold">Ask AI</Text>
        </div>
        <Button
          appearance="transparent"
          icon={<Dismiss24Regular />}
          onClick={onClose}
          aria-label="Close"
        />
      </div>

      <div className={styles.contentArea}>
        {blocks.length === 0 && !isCurrentChatStreaming ? (
          <InitialView
            icon={<Sparkle48Filled style={{ scale: 1.6 }} />}
            title="Ask about this story"
            starters={STORY_CONVERSATION_STARTERS}
            onSuggestionClick={handleSendMessage}
          />
        ) : (
          <ChatLog
            blocks={blocks}
            status={isCurrentChatStreaming ? 'streaming' : 'idle'}
            currentAiTask={isCurrentChatStreaming ? currentAiTask : null}
          />
        )}
      </div>

      {/* 👈 เพิ่ม prop size เข้าไป */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        isStreaming={isCurrentChatStreaming}
        sourceInfoText="This chat follows this story."
        size="medium"
      />
    </div>
  );
}

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
}

export function AskAiPanel({ story, onClose }: AskAiPanelProps) {
  const styles = useStyles();
  const {
    blocks,
    status,
    currentAiTask,
    threadId,
    sendMessage: sendMessageFromStore,
    clearChat,
    updateLastMessageWithData,
  } = useChatSessionStore();
  const { fetchConversations: refreshHistory } = useChatHistoryStore();

  const isStreaming = status === 'streaming';

  useEffect(() => {
    clearChat();
  }, [clearChat]);

  const handleSendMessage = (text: string) => {
    const currentThreadId = useChatSessionStore.getState().threadId;

    // ✨ ใช้ .then() เพื่อให้ UI update ทันทีโดยไม่รอ API
    sendMessageFromStore(text, currentThreadId, story.id).then((newThreadId) => {
      if (!currentThreadId && newThreadId) {
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
          <Sparkle24Filled />
          <Text weight="semibold">Ask about this Story</Text>
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

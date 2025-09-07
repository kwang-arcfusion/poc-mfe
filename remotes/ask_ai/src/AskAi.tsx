// remotes/ask_ai/src/AskAi.tsx
import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@fluentui/react-components';
import { SearchSparkle48Color } from '@fluentui/react-icons';
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

const ASK_AI_CONVERSATION_STARTERS = [
  'What changed in CTR last week?',
  'Which creatives drove conversions?',
  'Highlight underperforming campaigns.',
  'Summarize performance by channel.',
];

export default function AskAi({ navigate, chatId }: AskAiProps) {
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
    if (chatId && unreadResponses.some((r) => r.threadId === chatId)) {
      removeUnreadResponse(chatId);
    }
  }, [chatId, unreadResponses, removeUnreadResponse]);

  useEffect(() => {
    const { loadConversation, clearChat } = storeApi.getState();
    const currentStoreThreadId = storeApi.getState().threadId;

    if (chatId) {
      if (chatId !== currentStoreThreadId) {
        loadConversation(chatId);
      }
    } else {
      if (status !== 'streaming') {
        clearChat();
      }
    }
  }, [chatId, status, storeApi]);

  const isCurrentChatStreaming = status === 'streaming';

  const handleSendMessage = (text: string) => {
    const { sendMessage, updateLastMessageWithData, threadId: currentThreadId } =
      storeApi.getState();

    sendMessage(text, currentThreadId).then((newThreadId) => {
      if (isMountedRef.current && !currentThreadId && newThreadId) {
        navigate(`/ask_ai/${newThreadId}`, { replace: true });
        refreshHistory();
      }

      if (newThreadId) {
        updateLastMessageWithData(newThreadId);
        if (!isMountedRef.current) {
          addUnreadResponse({
            threadId: newThreadId,
            title: text,
            storyId: null,
          });
        }
      }
    });
  };

  return (
    <div className={styles.root}>
      {blocks.length === 0 && !isCurrentChatStreaming ? (
        <InitialView
          icon={<SearchSparkle48Color />}
          starters={ASK_AI_CONVERSATION_STARTERS}
          onSuggestionClick={handleSendMessage}
        />
      ) : (
        <ChatLog
          blocks={blocks}
          status={isCurrentChatStreaming ? 'streaming' : 'idle'}
          currentAiTask={isCurrentChatStreaming ? currentAiTask : null}
        />
      )}
      {/* 👈 เพิ่ม prop size เข้าไป */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        isStreaming={isCurrentChatStreaming}
        sourceInfoText="This conversation is based on multiple sources."
        size="large"
      />
    </div>
  );
}
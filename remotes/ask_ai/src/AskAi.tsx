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
    loadConversation,
    sendMessage: sendMessageFromStore,
    clearChat,
    updateLastMessageWithData,
  } = useChatSessionStore();
  const { fetchConversations: refreshHistory } = useChatHistoryStore();

  const isStreaming = status === 'streaming';

  useEffect(() => {
    if (status === 'streaming') {
      return;
    }

    if (chatId && chatId !== threadId) {
      loadConversation(chatId);
    }
    else if (!chatId && threadId) {
      clearChat();
    }
  }, [chatId, threadId, status, loadConversation, clearChat]);

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

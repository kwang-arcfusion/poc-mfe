// remotes/ask_ai/src/AskAi.tsx
import React from 'react';
import { useEffect, useRef } from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Textarea,
  Button,
  Spinner,
} from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { useChatHistoryStore, useChatSessionStore } from '@arcfusion/store';

import { ChatTitleBar } from './components/ChatTitleBar';
import { ChatMessage } from './components/ChatMessage';
import { InitialView } from './components/InitialView';
import { AssetTabs } from './components/AssetTabs';
import { findLastAiTextIndex } from './helpers/blocks';

interface AskAiProps {
  navigate: (path: string, options?: { replace?: boolean }) => void;
  chatId?: string;
}

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%' },
  contentArea: { flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXXXL),
    width: '100%',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
  },
  bottomBar: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: tokens.spacingVerticalS,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    width: '100%',
    maxWidth: '800px',
    position: 'relative',
  },
  textarea: { width: '100%', paddingRight: '50px' },
  sendButton: { position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)' },
  sourceInfo: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    ...shorthands.padding(tokens.spacingVerticalS, 0),
  },
});

export default function AskAi({ navigate, chatId }: AskAiProps) {
  const styles = useStyles();
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // State and actions are now from our global Zustand store
  const {
    blocks,
    status,
    activePrompt,
    isLoadingHistory,
    loadConversation,
    sendMessage: sendMessageFromStore,
    clearChat,
  } = useChatSessionStore();

  const { fetchConversations: refreshHistory } = useChatHistoryStore();
  const [inputValue, setInputValue] = React.useState('');
  const isStreaming = status === 'streaming';

  // Effect to sync URL chatId with the store's threadId
  useEffect(() => {
    // When the component mounts or chatId from URL changes...
    if (chatId) {
      // If the store's ID is different, load the conversation.
      if (useChatSessionStore.getState().threadId !== chatId) {
        loadConversation(chatId);
      }
    } else {
      // If there's no chatId, it's a new chat session.
      clearChat();
    }
  }, [chatId, loadConversation, clearChat]);

  // Effect to scroll to bottom on new blocks
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
    }
  }, [blocks]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setInputValue('');
    const currentThreadId = useChatSessionStore.getState().threadId;

    const newThreadId = await sendMessageFromStore(trimmed, currentThreadId);

    // If it was a new chat, navigate to the new URL and refresh history
    if (!currentThreadId && newThreadId) {
      navigate(`/ask_ai/${newThreadId}`, { replace: true });
      refreshHistory();
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.contentArea} ref={contentAreaRef}>
        {blocks.length > 0 ? (
          <>
            <ChatTitleBar title={activePrompt || 'Conversation'} />
            <div className={styles.chatContainer}>
              {blocks.map((b, i) =>
                b.kind === 'text' ? (
                  <ChatMessage
                    key={(b as any).id}
                    sender={(b as any).sender}
                    content={(b as any).content}
                    isStreaming={
                      isStreaming &&
                      i === findLastAiTextIndex(blocks) &&
                      (b as any).content.length === 0
                    }
                  />
                ) : (
                  <AssetTabs key={(b as any).id} group={(b as any).group} />
                )
              )}
            </div>
          </>
        ) : (
          <InitialView onSuggestionClick={handleSendMessage} />
        )}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.inputContainer}>
          <Textarea
            resize="vertical"
            placeholder="Ask Anything..."
            className={styles.textarea}
            size="large"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(inputValue);
              }
            }}
          />
          <Button
            appearance="transparent"
            icon={<Send24Regular />}
            className={styles.sendButton}
            aria-label="Send message"
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isStreaming}
          />
        </div>
        <div className={styles.sourceInfo}>
          This conversation draws on information from multiple sources.
        </div>
      </div>
    </div>
  );
}

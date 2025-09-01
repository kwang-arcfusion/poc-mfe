// remotes/ask_ai/src/AskAi.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Textarea,
  Button,
  Spinner,
  Body1,
} from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { useChatHistoryStore, useChatSessionStore } from '@arcfusion/store';
import { ChatTitleBar } from './components/ChatTitleBar';
import { ChatMessage } from './components/ChatMessage';
import { InitialView } from './components/InitialView';
import { AssetTabs } from './components/AssetTabs';
import type { Block } from './types';

const useStatusStyles = makeStyles({
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground3,
  },
});
const TASK_DISPLAY_TEXT: Record<string, string> = {
  thinking: 'Thinking',
  'creating sql': 'Creating SQL',
  'creating table': 'Creating Table',
  answering: 'Answering',
};
const AiStatusIndicator = ({ task }: { task: string | null }) => {
  const styles = useStatusStyles();
  if (!task) return null;
  const displayText = TASK_DISPLAY_TEXT[task] || 'Processing';
  return (
    <div className={styles.statusContainer}>
      <Spinner size="tiny" />
      <Body1>{displayText}...</Body1>
    </div>
  );
};

interface AskAiProps {
  navigate: (path: string, options?: { replace?: boolean }) => void;
  chatId?: string;
}

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', width: '100%', height: '100%' },
  contentArea: { flexGrow: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
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
  aiTurnWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    ...shorthands.gap(tokens.spacingVerticalL),
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
    maxWidth: '820px',
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

  const {
    blocks,
    status,
    activePrompt,
    currentAiTask,
    loadConversation,
    sendMessage: sendMessageFromStore,
    clearChat,
  } = useChatSessionStore();

  const { fetchConversations: refreshHistory } = useChatHistoryStore();
  const [inputValue, setInputValue] = React.useState('');
  const isStreaming = status === 'streaming';
  const [isStopAutoScrollDown, setIsStopAutoScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStopAutoScrollDown) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [blocks, isStopAutoScrollDown]);

  useEffect(() => {
    if (chatId) {
      if (useChatSessionStore.getState().threadId !== chatId) loadConversation(chatId);
    } else {
      clearChat();
    }
  }, [chatId, loadConversation, clearChat]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;

      if (isAtBottom) {
        setIsStopAutoScrollDown(false);
      } else {
        setIsStopAutoScrollDown(true);
      }
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    setInputValue('');

    setIsStopAutoScrollDown(false);

    const currentThreadId = useChatSessionStore.getState().threadId;
    const newThreadId = await sendMessageFromStore(trimmed, currentThreadId);
    if (!currentThreadId && newThreadId) {
      navigate(`/ask_ai/${newThreadId}`, { replace: true });
      refreshHistory();
    }
  };

  const groupedTurns = React.useMemo(() => {
    if (!blocks.length) return [];

    const turns: { sender: 'user' | 'ai'; blocks: Block[] }[] = [];

    blocks.forEach((block) => {
      const lastTurn = turns[turns.length - 1];
      // ตรวจสอบ sender ของ block ปัจจุบันอย่างปลอดภัย
      const currentSender = block.kind === 'text' ? block.sender : 'ai';

      if (lastTurn && lastTurn.sender === currentSender) {
        lastTurn.blocks.push(block);
      } else {
        turns.push({ sender: currentSender, blocks: [block] });
      }
    });
    return turns;
  }, [blocks]);

  return (
    <div className={styles.root}>
      <div className={styles.contentArea} ref={scrollContainerRef}>
        {blocks.length === 0 && !isStreaming ? (
          <InitialView onSuggestionClick={handleSendMessage} />
        ) : (
          <>
            <div className={styles.chatContainer}>
              {groupedTurns.map((turn, turnIndex) => {
                // สำหรับ User Turn: จะมีแค่ TextBlock เท่านั้น
                if (turn.sender === 'user') {
                  const userBlock = turn.blocks[0];
                  // ตรวจสอบให้แน่ใจว่าเป็น TextBlock ก่อน Render
                  if (userBlock.kind === 'text') {
                    return (
                      <ChatMessage key={turnIndex} sender="user" content={userBlock.content} />
                    );
                  }
                  return null;
                }

                // สำหรับ AI Turn: อาจจะมีทั้ง TextBlock และ AssetsBlock
                return (
                  <div key={turnIndex} className={styles.aiTurnWrapper}>
                    {isStreaming && turnIndex === groupedTurns.length - 1 && (
                      <AiStatusIndicator task={currentAiTask} />
                    )}
                    {turn.blocks.map((block) =>
                      block.kind === 'text' ? (
                        <ChatMessage key={block.id} sender="ai" content={block.content} />
                      ) : (
                        <AssetTabs key={block.id} group={block.group} />
                      )
                    )}
                  </div>
                );
              })}

              {isStreaming &&
                (groupedTurns[groupedTurns.length - 1]?.sender === 'user' ||
                  groupedTurns.length === 0) && (
                  <div className={styles.aiTurnWrapper}>
                    <AiStatusIndicator task={currentAiTask} />
                  </div>
                )}
              <div ref={messagesEndRef} />
            </div>
          </>
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

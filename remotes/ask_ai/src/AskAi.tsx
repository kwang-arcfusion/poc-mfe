// remotes/ask_ai/src/AskAi.tsx
import React, { useEffect, useRef } from 'react';
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

// Component สำหรับแสดงสถานะ AI (ไม่เปลี่ยนแปลง)
const useStatusStyles = makeStyles({
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground3,
    // marginBottom ถูกเอาออกไป เพราะจะใช้ gap จาก parent แทน
  },
});
const TASK_DISPLAY_TEXT: Record<string, string> = {
  thinking: 'Thinking',
  'creating sql': 'Creating SQL',
  'creating table': 'Creating table',
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
    // ✨ กลับไปใช้ gap เดิม ✨
    ...shorthands.gap(tokens.spacingVerticalL),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXXXL),
    width: '100%',
    maxWidth: '900px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxSizing: 'border-box',
  },
  // ✨ START: แก้ไข Wrapper ของ AI ให้ไม่มี Style ที่มองเห็น ✨
  aiTurnWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // จัด content ข้างในให้ชิดซ้าย
    ...shorthands.gap(tokens.spacingVerticalL), // ระยะห่างระหว่าง status กับ content
  },
  // ✨ END: แก้ไข Wrapper ✨
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

  useEffect(() => {
    if (chatId) {
      if (useChatSessionStore.getState().threadId !== chatId) loadConversation(chatId);
    } else {
      clearChat();
    }
  }, [chatId, loadConversation, clearChat]);

  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    setInputValue('');
    const currentThreadId = useChatSessionStore.getState().threadId;
    const newThreadId = await sendMessageFromStore(trimmed, currentThreadId);
    if (!currentThreadId && newThreadId) {
      navigate(`/ask_ai/${newThreadId}`, { replace: true });
      refreshHistory();
    }
  };

  const groupedTurns = React.useMemo(() => {
    if (!blocks.length) return [];
    const turns: { sender: 'user' | 'ai'; blocks: typeof blocks }[] = [];
    blocks.forEach((block) => {
      const lastTurn = turns[turns.length - 1];
      if (lastTurn && lastTurn.sender === block.sender) {
        lastTurn.blocks.push(block);
      } else {
        turns.push({ sender: block.sender, blocks: [block] });
      }
    });
    return turns;
  }, [blocks]);

  return (
    <div className={styles.root}>
      <div className={styles.contentArea}>
        {blocks.length === 0 && !isStreaming ? (
          <InitialView onSuggestionClick={handleSendMessage} />
        ) : (
          <>
            <ChatTitleBar title={activePrompt || 'New Chat'} />
            <div className={styles.chatContainer}>
              {groupedTurns.map((turn, turnIndex) =>
                turn.sender === 'user' ? (
                  <ChatMessage key={turnIndex} sender="user" content={turn.blocks[0].content} />
                ) : (
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
                )
              )}
              {isStreaming &&
                (groupedTurns[groupedTurns.length - 1]?.sender === 'user' ||
                  groupedTurns.length === 0) && (
                  <div className={styles.aiTurnWrapper}>
                    <AiStatusIndicator task={currentAiTask} />
                  </div>
                )}
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

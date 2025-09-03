// packages/ui/src/components/Chat/ChatLog.tsx
import React, { useRef, useEffect, useCallback, useState } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
// ✨ 1. แก้ไข Path การ Import Type จาก '../types' เป็น '@arcfusion/types'
import type { Block, TextBlock } from '@arcfusion/types';
import { ChatMessage } from './ChatMessage';
import { AssetTabs } from './AssetTabs';
import { AiStatusIndicator } from './AiStatusIndicator';

const useStyles = makeStyles({
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
});

interface ChatLogProps {
  blocks: Block[];
  status: 'idle' | 'streaming' | 'completed' | 'error';
  currentAiTask: string | null;
}

export const ChatLog: React.FC<ChatLogProps> = ({ blocks, status, currentAiTask }) => {
  const styles = useStyles();
  const [isStopAutoScrollDown, setIsStopAutoScrollDown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStopAutoScrollDown) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [blocks, isStopAutoScrollDown]);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 5;
      setIsStopAutoScrollDown(!isAtBottom);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const groupedTurns = React.useMemo(() => {
    if (!blocks.length) return [];
    const turns: { sender: 'user' | 'ai'; blocks: Block[] }[] = [];
    blocks.forEach((block) => {
      const lastTurn = turns[turns.length - 1];
      const currentSender = block.kind === 'text' ? block.sender : 'ai';
      if (lastTurn && lastTurn.sender === currentSender) {
        lastTurn.blocks.push(block);
      } else {
        turns.push({ sender: currentSender, blocks: [block] });
      }
    });
    return turns;
  }, [blocks]);

  const isStreaming = status === 'streaming';

  return (
    <div className={styles.contentArea} ref={scrollContainerRef}>
      <div className={styles.chatContainer}>
        {groupedTurns.map((turn, turnIndex) => {
          if (turn.sender === 'user') {
            const userBlock = turn.blocks[0] as TextBlock;
            return (
              <ChatMessage
                key={userBlock.id || turnIndex}
                sender="user"
                content={userBlock.content}
              />
            );
          }
          return (
            <div key={turnIndex} className={styles.aiTurnWrapper}>
              {isStreaming && turnIndex === groupedTurns.length - 1 && (
                <AiStatusIndicator task={currentAiTask} />
              )}
              {turn.blocks.map((block) =>
                block.kind === 'text' ? (
                  <ChatMessage
                    key={block.id}
                    sender="ai"
                    content={block.content}
                    messageId={block.messageId}
                  />
                ) : (
                  <AssetTabs key={block.id} group={block.group} messageId={block.messageId} />
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
    </div>
  );
};

// packages/ui/src/components/Chat/ChatLog.tsx

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
// ✨ 1. Import Type ที่เราต้องการใช้งาน
import type { Block, TextBlock, ChatMessage } from '@arcfusion/types';
// ✨ 2. เปลี่ยนชื่อ import เพื่อไม่ให้ซ้ำกับ Type
import { ChatMessage as ChatMessageComponent } from './ChatMessage';
import { AssetTabs } from './AssetTabs';
import { AiStatusIndicator } from './AiStatusIndicator';
import { FeedbackControls } from './FeedbackControls';

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
  },
});

interface ChatLogProps {
  blocks: Block[];
  status: 'idle' | 'streaming' | 'completed' | 'error';
  currentAiTask: string | null;
  // ✨ 3. รับ messages ทั้งหมดเข้ามาเพื่อค้นหา feedback
  rawMessages?: ChatMessage[];
}

export const ChatLog: React.FC<ChatLogProps> = ({ blocks, status, currentAiTask, rawMessages = [] }) => {
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
              <ChatMessageComponent
                key={userBlock.id || turnIndex}
                sender="user"
                content={userBlock.content}
              />
            );
          }

          const lastBlockInTurn = turn.blocks[turn.blocks.length - 1];
          const turnMessageId = lastBlockInTurn?.messageId;
          const hasContent = turn.blocks.some(
            (b) => (b.kind === 'text' && b.content) || b.kind === 'assets'
          );

          // ✨ 4. ค้นหา message และ feedback ที่ตรงกัน
          const currentMessage = rawMessages.find(msg => msg.id === turnMessageId);
          const initialFeedback = currentMessage?.feedback;

          return (
            <div key={turnIndex} className={styles.aiTurnWrapper}>
              {isStreaming && turnIndex === groupedTurns.length - 1 && (
                <AiStatusIndicator task={currentAiTask} />
              )}
              {turn.blocks.map((block) =>
                block.kind === 'text' ? (
                  <ChatMessageComponent
                    key={block.id}
                    sender="ai"
                    content={block.content}
                    messageId={block.messageId}
                  />
                ) : (
                  <AssetTabs key={block.id} group={block.group} messageId={block.messageId} />
                )
              )}
              {!(isStreaming && turnIndex === groupedTurns.length - 1) && hasContent && (
                // ✨ 5. ส่ง initialFeedback ลงไปเป็น prop
                <FeedbackControls messageId={turnMessageId} initialFeedback={initialFeedback} />
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
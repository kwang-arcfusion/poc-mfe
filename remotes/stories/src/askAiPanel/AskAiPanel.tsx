// remotes/stories/src/askAiPanel/AskAiPanel.tsx
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Textarea,
  Button,
  Text, // ✨ 1. Import Text component
} from '@fluentui/react-components';
import {
  Send24Regular,
  Dismiss24Regular,
  Sparkle24Filled, // ✨ 2. Import ไอคอน Sparkle
} from '@fluentui/react-icons';
import { useJsonEventStreaming } from './hooks/useSimulatedStreaming';
import { ChatMessage } from './components/ChatMessage';
import { InitialView } from './components/InitialView';
import type { Block, TextBlock } from './helpers/blocks';
import { findLastAiTextIndex } from './helpers/blocks';

const useStyles = makeStyles({
  panelRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
  },
  // ✨ 3. ปรับแก้ Style ของ Header และเพิ่ม titleGroup
  header: {
    display: 'flex',
    justifyContent: 'space-between', // จัดให้ Title อยู่ซ้าย ปุ่มอยู่ขวา
    alignItems: 'center',
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalM), // เพิ่ม padding ซ้ายขวา
    flexShrink: 0,
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    color: tokens.colorBrandForeground1, // ใช้สี Brand
  },
  contentArea: {
    flexGrow: 1,
    overflowY: 'auto',
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalM),
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
  },
  bottomBar: {
    flexShrink: 0,
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke2),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    position: 'relative',
  },
  textarea: {
    width: '100%',
    paddingRight: '40px',
  },
  sendButton: {
    position: 'absolute',
    right: '4px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
});

interface AskAiPanelProps {
  onClose: () => void;
}

export function AskAiPanel({ onClose }: AskAiPanelProps) {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const { status, startStreaming, lastEvent } = useJsonEventStreaming();
  const isStreaming = status === 'streaming';
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // ... (ส่วน Logic ทั้งหมดเหมือนเดิม ไม่มีการเปลี่ยนแปลง) ...
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
    }
  }, [blocks]);

  const lastAiIndex = findLastAiTextIndex(blocks);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const t = Date.now();
    setBlocks((prev) => [
      ...prev,
      { kind: 'text', id: t, sender: 'user', content: trimmed },
      { kind: 'text', id: t + 1, sender: 'ai', content: '' },
    ]);
    startStreaming();
    setInputValue('');
  };

  useEffect(() => {
    if (!lastEvent) return;
    setBlocks((prev) => {
      const next = [...prev];
      if (lastEvent.type === 'answer.delta') {
        const text = lastEvent.payload?.text || '';
        const tail = next[next.length - 1];
        if (tail?.kind === 'text' && tail.sender === 'ai') {
          next[next.length - 1] = { ...tail, content: tail.content + text } as TextBlock;
        } else {
          next.push({ kind: 'text', id: Date.now(), sender: 'ai', content: text });
        }
      }
      return next;
    });
  }, [lastEvent?.seq]);

  return (
    <div className={styles.panelRoot}>
      {/* ✨ 4. อัปเดต JSX ในส่วนของ Header */}
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Sparkle24Filled />
          <Text weight="semibold">Ask AI</Text>
        </div>
        <Button
          appearance="transparent"
          icon={<Dismiss24Regular />}
          onClick={onClose}
          aria-label="Close"
        />
      </div>

      <div className={styles.contentArea} ref={contentAreaRef}>
        {blocks.length > 0 ? (
          <div className={styles.chatContainer}>
            {blocks.map((b, i) =>
              b.kind === 'text' ? (
                <ChatMessage
                  key={b.id}
                  sender={b.sender}
                  content={b.content}
                  isStreaming={isStreaming && i === lastAiIndex}
                />
              ) : null
            )}
          </div>
        ) : (
          <InitialView onSuggestionClick={sendMessage} />
        )}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.inputContainer}>
          <Textarea
            resize="vertical"
            placeholder="Ask anything..."
            size="small"
            className={styles.textarea}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputValue);
              }
            }}
          />
          <Button
            appearance="transparent"
            icon={<Send24Regular />}
            className={styles.sendButton}
            aria-label="Send"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim()}
          />
        </div>
      </div>
    </div>
  );
}

import * as React from 'react';
import { makeStyles, tokens, shorthands, Textarea, Button } from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';

import { useJsonEventStreaming } from './hooks/useSimulatedStreaming';
import { ChatTitleBar } from './components/ChatTitleBar';
import { ChatMessage } from './components/ChatMessage';
import { InitialView } from './components/InitialView';
import { AssetTabs } from './components/AssetTabs';

import type { Block, TextBlock } from './blocks';
import { findLastAiTextIndex } from './blocks';

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

export default function AskAi() {
  const styles = useStyles();

  // state หลัก
  const [inputValue, setInputValue] = React.useState('');
  const [blocks, setBlocks] = React.useState<Block[]>([]);
  const [activePrompt, setActivePrompt] = React.useState<string | null>(null);

  // สตรีม JSON events (mock) — พร้อมสลับเป็น WS/SSE จริง
  const { status, startStreaming, lastEvent } = useJsonEventStreaming();
  const isStreaming = status === 'streaming';

  // auto scroll
  const contentAreaRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
    }
  }, [blocks]);

  // helper
  const lastAiIndex = findLastAiTextIndex(blocks);

  // ส่งข้อความ
  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const t = Date.now();
    setActivePrompt(trimmed);
    setBlocks((prev) => [
      ...prev,
      { kind: 'text', id: t, sender: 'user', content: trimmed },
      { kind: 'text', id: t + 1, sender: 'ai', content: '' }, // bubble สำหรับสตรีมรอบนี้
    ]);

    startStreaming();
    setInputValue('');
  };

  // apply JSON events → สร้าง/ต่อบล็อกตามลำดับ: text → assets → text → assets
  React.useEffect(() => {
    if (!lastEvent) return;

    setBlocks((prev) => {
      const next = [...prev];

      switch (lastEvent.type) {
        case 'answer.delta': {
          const text = lastEvent.payload?.text || '';
          // ถ้าบล็อกท้ายสุดเป็น text ของ AI → ต่อ; ไม่งั้นเปิดบล็อกใหม่
          const tail = next[next.length - 1];
          if (tail && tail.kind === 'text' && tail.sender === 'ai') {
            next[next.length - 1] = { ...tail, content: tail.content + text } as TextBlock;
          } else {
            next.push({ kind: 'text', id: Date.now(), sender: 'ai', content: text });
          }
          break;
        }
        case 'assets.push': {
          next.push({ kind: 'assets', id: Date.now(), group: lastEvent.payload });
          break;
        }
        case 'done':
        default:
          break;
      }

      return next;
    });
    // ใช้ seq เป็นคีย์ให้ effect ทำงานเฉพาะเมื่อมีอีเวนต์ใหม่
  }, [lastEvent?.seq]);

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
                    key={b.id}
                    sender={b.sender}
                    content={b.content}
                    isStreaming={isStreaming && i === lastAiIndex}
                  />
                ) : (
                  <AssetTabs key={b.id} group={b.group} />
                )
              )}
            </div>
          </>
        ) : (
          <InitialView onSuggestionClick={sendMessage} />
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
                sendMessage(inputValue);
              }
            }}
          />
          <Button
            appearance="transparent"
            icon={<Send24Regular />}
            className={styles.sendButton}
            aria-label="Send message"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim()}
          />
        </div>
        <div className={styles.sourceInfo}>
          This conversation draws on information from multiple sources.
        </div>
      </div>
    </div>
  );
}

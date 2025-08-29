// remotes/ask_ai/src/AskAi.tsx
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { makeStyles, tokens, shorthands, Textarea, Button } from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';

import { useChatStreaming } from './hooks/useChatStreaming';
import { v4 as uuidv4 } from 'uuid';
import { ChatTitleBar } from './components/ChatTitleBar';
import { ChatMessage } from './components/ChatMessage';
import { InitialView } from './components/InitialView';
import { AssetTabs } from './components/AssetTabs';

import type { Block, TextBlock } from './helpers/blocks';
import { findLastAiTextIndex } from './helpers/blocks';
import { AssetGroup } from './types';

// ... useStyles ไม่มีการเปลี่ยนแปลง ...
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

  const [inputValue, setInputValue] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string>(() => uuidv4());

  const { status, startStreaming, events, error } = useChatStreaming();
  const isStreaming = status === 'streaming';
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // ✨ --- START: เพิ่ม Ref เพื่อ "จำ" สถานะ --- ✨
  // Ref เพื่อจำว่าเราประมวลผล event ไปแล้วกี่ตัว
  const processedEventsCount = useRef(0);
  // Ref เพื่อเก็บ asset ที่ยังไม่ได้สร้างเป็น block
  const pendingAssets = useRef<AssetGroup>({ id: uuidv4(), sqls: [], dataframes: [], charts: [] });
  // ✨ --- END: เพิ่ม Ref --- ✨

  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
    }
  }, [blocks]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMessageId = Date.now();
    if (blocks.length === 0) {
      setActivePrompt(trimmed);
    }

    // ✨ --- START: Reset Ref เมื่อส่งข้อความใหม่ --- ✨
    processedEventsCount.current = 0;
    pendingAssets.current = { id: uuidv4(), sqls: [], dataframes: [], charts: [] };
    // ✨ --- END: Reset Ref --- ✨

    setBlocks((prev) => [
      ...prev,
      { kind: 'text', id: userMessageId, sender: 'user', content: trimmed },
      { kind: 'text', id: userMessageId + 1, sender: 'ai', content: '' },
    ]);

    startStreaming(trimmed, threadId);
    setInputValue('');
  };

  // ✨ --- START: แก้ไข useEffect ทั้งหมด --- ✨
  useEffect(() => {
    // หา event ใหม่ที่ยังไม่เคยประมวลผล
    const newEvents = events.slice(processedEventsCount.current);
    if (newEvents.length === 0) return;

    // ตัวแปรชั่วคราวสำหรับเก็บ block ที่สร้างจาก event ใหม่
    const blocksFromNewEvents: Block[] = [];

    // ฟังก์ชันสำหรับสร้าง Asset Block จาก pendingAssets
    const processPendingAssets = () => {
      const pa = pendingAssets.current;
      if (pa.sqls.length > 0 || pa.dataframes.length > 0 || pa.charts.length > 0) {
        blocksFromNewEvents.push({ kind: 'assets', id: Date.now(), group: { ...pa } });
        // Reset pending assets
        pendingAssets.current = { id: uuidv4(), sqls: [], dataframes: [], charts: [] };
      }
    };

    // ประมวลผล "เฉพาะ" event ใหม่
    newEvents.forEach((event, index) => {
      if ('sql_query' in event) {
        pendingAssets.current.sqls.push({
          id: `sql-${index}`,
          title: 'Generated SQL',
          sql: event.sql_query,
        });
      } else if ('sql_query_result' in event) {
        const df = event.sql_query_result;
        if (df && df.length > 0) {
          pendingAssets.current.dataframes.push({
            id: `df-${index}`,
            title: 'Query Result',
            columns: Object.keys(df[0]),
            rows: df.map((row) => Object.values(row)),
          });
        }
      } else if ('answer_chunk' in event || 'answer' in event) {
        // เมื่อเจอ text ให้สร้าง asset block ที่ค้างอยู่ก่อน
        processPendingAssets();
        // เพิ่ม text block เข้าไป
        const textContent = (event as any).answer_chunk || (event as any).answer;
        if (textContent) {
          blocksFromNewEvents.push({
            kind: 'text',
            id: Date.now() + index,
            sender: 'ai',
            content: textContent,
          });
        }
      }
      // TODO: Handle 'chart_builder_result'
    });

    // สร้าง asset block สุดท้ายที่อาจจะยังค้างอยู่ (กรณีที่ไม่มี text ตามหลัง)
    processPendingAssets();

    // อัปเดต state อย่างถูกต้อง
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      const lastBlock = updatedBlocks[updatedBlocks.length - 1];

      // รวม text block ที่ต่อเนื่องกันให้เป็น block เดียว
      const mergedNewBlocks: Block[] = [];
      let lastMergedBlock: Block | null = null;

      // ลบ "AI กำลังพิมพ์..." ตัวเปล่าๆ ออกก่อน
      if (lastBlock?.kind === 'text' && lastBlock.sender === 'ai' && lastBlock.content === '') {
        updatedBlocks.pop();
      }

      for (const newBlock of blocksFromNewEvents) {
        const lastPrevBlock =
          mergedNewBlocks.length > 0
            ? mergedNewBlocks[mergedNewBlocks.length - 1]
            : updatedBlocks[updatedBlocks.length - 1];

        // ถ้่า block ใหม่และ block ก่อนหน้าเป็น text chunk ให้รวมกัน
        if (
          newBlock.kind === 'text' &&
          lastPrevBlock?.kind === 'text' &&
          lastPrevBlock.sender === 'ai'
        ) {
          lastPrevBlock.content += newBlock.content;
        } else {
          mergedNewBlocks.push(newBlock);
        }
      }

      return [...updatedBlocks, ...mergedNewBlocks];
    });

    // อัปเดตจำนวน event ที่ประมวลผลไปแล้ว
    processedEventsCount.current = events.length;
  }, [events]);
  // ✨ --- END: แก้ไข useEffect ทั้งหมด --- ✨

  return (
    // ... ส่วน JSX ไม่มีการเปลี่ยนแปลง ...
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
                    isStreaming={
                      isStreaming && i === findLastAiTextIndex(blocks) && b.content.length === 0
                    }
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

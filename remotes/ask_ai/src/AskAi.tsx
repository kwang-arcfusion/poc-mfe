// remotes/ask_ai/src/AskAi.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Textarea,
  Button,
  Title3,
  Badge,
} from '@fluentui/react-components';
import { SearchSparkle48Color, Send24Regular } from '@fluentui/react-icons';

import { useSimulatedStreaming } from './hooks/useSimulatedStreaming';
import { ChatTitleBar } from './components/ChatTitleBar';
import { ChatMessage } from './components/ChatMessage'; // <-- Import component ใหม่

// --- 1. กำหนด Type สำหรับข้อความ ---
type Message = {
  id: number;
  sender: 'user' | 'ai';
  content: string;
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  contentArea: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  // --- Style ใหม่สำหรับพื้นที่แสดง Chat ---
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap(tokens.spacingVerticalL),
    ...shorthands.padding(tokens.spacingVerticalL, tokens.spacingHorizontalXXXL),

    width: '100%', // ยังคงไว้เพื่อให้แน่ใจว่า container พยายามเต็มพื้นที่ก่อนถูกจำกัด
    maxWidth: '900px', // กำหนดความกว้างสูงสุด (ปรับค่าได้ตามต้องการ)
    marginLeft: 'auto', // จัดให้อยู่ตรงกลางแนวนอน
    marginRight: 'auto', // จัดให้อยู่ตรงกลางแนวนอน

    boxSizing: 'border-box',
  },
  bottomBar: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingBottom: tokens.spacingVerticalS,
  },
  initialViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    ...shorthands.gap('24px'),
    height: '100%',
  },
  icon: {
    color: tokens.colorBrandForeground1,
  },
  title: {
    color: tokens.colorNeutralForeground1,
  },
  suggestionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    maxWidth: '620px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    width: '100%',
    maxWidth: '800px',
    position: 'relative',
  },
  textarea: {
    width: '100%',
    paddingRight: '50px',
  },
  sendButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  sourceInfo: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
    ...shorthands.padding(tokens.spacingVerticalS, 0),
  },
});

const conversationStarters = [
  'What changed in CTR last week?',
  'Which creatives drove conversions?',
  'Highlight underperforming campaigns.',
  'Summarize performance by channel.',
];

const InitialView = ({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) => {
  const styles = useStyles();
  return (
    <div className={styles.initialViewContainer}>
      <SearchSparkle48Color className={styles.icon} />
      <Title3 as="h1" className={styles.title}>
        Finding the fresh insights today?
      </Title3>
      <div className={styles.suggestionsContainer}>
        {conversationStarters.map((text, index) => (
          <Badge
            key={index}
            size="extra-large"
            appearance="ghost"
            onClick={() => onSuggestionClick(text)}
          >
            {text}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default function AskAi() {
  const styles = useStyles();
  const [inputValue, setInputValue] = useState('');
  // --- 2. เปลี่ยน State จาก string เป็น Array ของ Message ---
  const [conversation, setConversation] = useState<Message[]>([]);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  const { response, status, startStreaming } = useSimulatedStreaming();
  const isStreaming = status === 'streaming';

  const contentAreaRef = useRef<HTMLDivElement>(null);

  // --- 3. Logic สำหรับเพิ่มข้อความและเริ่ม Streaming ---
  const sendMessage = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;

    setActivePrompt(trimmedText);

    // เพิ่มข้อความของ User เข้าไปใน Array
    setConversation((prev) => [...prev, { id: Date.now(), sender: 'user', content: trimmedText }]);

    startStreaming();
    setInputValue('');
  };

  // --- 4. ใช้ useEffect เพื่อจัดการ Response ของ AI ---
  useEffect(() => {
    // เมื่อ hook เริ่ม streaming หรือ stream จบแล้ว
    if (status === 'streaming' || status === 'completed') {
      setConversation((prev) => {
        const lastMessage = prev[prev.length - 1];
        // ถ้าข้อความล่าสุดเป็นของ AI ให้ update content
        if (lastMessage?.sender === 'ai') {
          const updatedConversation = [...prev];
          updatedConversation[prev.length - 1].content = response;
          return updatedConversation;
        }
        // ถ้ายังไม่มีข้อความของ AI ให้สร้างใหม่
        else {
          return [...prev, { id: Date.now() + 1, sender: 'ai', content: response }];
        }
      });
    }
  }, [response, status]);

  // --- Effect สำหรับ Auto-scroll ---
  useEffect(() => {
    if (contentAreaRef.current) {
      contentAreaRef.current.scrollTop = contentAreaRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <div className={styles.root}>
      <div className={styles.contentArea} ref={contentAreaRef}>
        {/* --- 5. เปลี่ยนการแสดงผลมาเป็นวนลูปจาก conversation --- */}
        {conversation.length > 0 ? (
          <>
            <ChatTitleBar title={activePrompt || 'Conversation'} />
            <div className={styles.chatContainer}>
              {conversation.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  sender={msg.sender}
                  content={msg.content}
                  // ส่ง isStreaming ไปให้เฉพาะข้อความของ AI อันล่าสุดเท่านั้น
                  isStreaming={
                    msg.sender === 'ai' && isStreaming && index === conversation.length - 1
                  }
                />
              ))}
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

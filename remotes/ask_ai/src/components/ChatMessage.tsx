// remotes/ask_ai/src/components/ChatMessage.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Body1, Spinner } from '@fluentui/react-components';
// ✨ 1. Import Library ที่ติดตั้งใหม่
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    maxWidth: '85%',
    width: 'fit-content',
    '&[data-sender="user"]': {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse',
    },
    '&[data-sender="ai"]': {
      alignSelf: 'flex-start',
    },
  },
  bubble: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    '&[data-sender="user"]': {
      backgroundColor: tokens.colorNeutralBackground1,
      color: tokens.colorNeutralForeground1,
    },
    '&[data-sender="ai"]': {
      backgroundColor: tokens.colorNeutralBackground2,
      color: tokens.colorNeutralForeground1,
    },
  },
  thinkingContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalM,
  },
  // ✨ 2. เพิ่ม Style สำหรับ Markdown
  markdown: {
    // ทำให้ Paragraph มีระยะห่างที่เหมาะสม
    '& p': {
      marginTop: 0,
      marginBottom: tokens.spacingVerticalS,
    },
    // จัดรูปแบบลิสต์ให้สวยงาม
    '& ul': {
      ...shorthands.padding(0, 0, 0, tokens.spacingHorizontalL),
      ...shorthands.margin(0),
    },
    '& li': {
      marginBottom: tokens.spacingVerticalXS,
    },
  },
});

interface ChatMessageProps {
  sender: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ sender, content, isStreaming }: ChatMessageProps) {
  const styles = useStyles();

  return (
    <div className={styles.root} data-sender={sender}>
      <div className={styles.bubble} data-sender={sender}>
        {isStreaming && (
          <div className={styles.thinkingContainer}>
            <Spinner size="tiny" />
            <span>Answering...</span>
          </div>
        )}

        {/* ✨ 3. เปลี่ยนจากการใช้ Body1 มาเป็น ReactMarkdown */}
        <div className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

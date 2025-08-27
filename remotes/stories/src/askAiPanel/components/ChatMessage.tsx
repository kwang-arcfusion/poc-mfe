// remotes/stories/src/askAiPanel/components/ChatMessage.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Body1, Spinner } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    maxWidth: '100%', // ปรับให้เต็มความกว้างของ panel
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
    ...shorthands.padding(tokens.spacingVerticalS, tokens.spacingHorizontalM), // ลด Padding
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    '&[data-sender="user"]': {
      backgroundColor: tokens.colorBrandBackground2, // เปลี่ยนสีให้เข้ากับ Theme
      color: tokens.colorNeutralForeground1,
    },
    '&[data-sender="ai"]': {
      backgroundColor: tokens.colorNeutralBackground3,
      color: tokens.colorNeutralForeground1,
    },
  },
  thinkingContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalXS,
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
        <Body1>{content}</Body1>
      </div>
    </div>
  );
}

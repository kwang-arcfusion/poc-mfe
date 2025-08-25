// remotes/ask_ai/src/components/ChatMessage.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Body1, Spinner, Avatar } from '@fluentui/react-components';
import { Person24Regular, Bot24Regular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    maxWidth: '85%',
    width: 'fit-content',
    // --- สไตล์สำหรับจัดตำแหน่ง ---
    '&[data-sender="user"]': {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse', // สลับ Avatar ไปทางขวา
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
    // --- สไตล์สำหรับสีของ Bubble ---
    '&[data-sender="user"]': {
      backgroundColor: tokens.colorBrandBackground,
      color: tokens.colorNeutralForegroundOnBrand,
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
    marginBottom: tokens.spacingVerticalM,
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

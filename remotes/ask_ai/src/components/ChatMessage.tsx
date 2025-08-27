// remotes/ask_ai/src/components/ChatMessage.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Body1, Spinner, Avatar } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    maxWidth: '85%',
    width: 'fit-content',
    '&[data-sender="user"]': {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse', // Swap Avatar to the right
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

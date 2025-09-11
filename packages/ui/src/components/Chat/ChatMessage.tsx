// packages/ui/src/components/Chat/ChatMessage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTypingEffectStore } from '@arcfusion/store';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    maxWidth: '85%',
    width: 'fit-content',
    flexDirection: 'column',
    '&[data-sender="user"]': {
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
    },
    '&[data-sender="ai"]': {
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
    },
  },
  bubble: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    '&[data-sender="user"]': {
      backgroundColor: tokens.colorNeutralStroke3,
      color: tokens.colorNeutralForeground1,
    },
    '&[data-sender="ai"]': {
      backgroundColor: tokens.colorNeutralBackground2,
      color: tokens.colorNeutralForeground1,
    },
  },
  markdown: {
    '& p': { marginTop: 0, marginBottom: tokens.spacingVerticalS },
    '& ul, & ol': {
      ...shorthands.padding(0, 0, 0, tokens.spacingHorizontalL),
      ...shorthands.margin(0),
    },
    '& li': { marginBottom: tokens.spacingVerticalXS },
  },
});

interface ChatMessageProps {
  sender: 'user' | 'ai';
  content: string;
  messageId?: string;
}

export function ChatMessage({ sender, content, messageId }: ChatMessageProps) {
  const styles = useStyles();
  const [displayedText, setDisplayedText] = useState('');
  const animationTimeoutRef = useRef<number>();
  const debounceTimeoutRef = useRef<number>();
  const speed = 20;

  const { typingMessageIds, stopTyping } = useTypingEffectStore();
  const isTyping = messageId ? typingMessageIds.has(messageId) : false;

  useEffect(() => {
    return () => {
      clearTimeout(animationTimeoutRef.current);
      clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (sender === 'user') {
      setDisplayedText(content);
      return;
    }

    if (isTyping) {
      if (displayedText !== content) {
        clearTimeout(debounceTimeoutRef.current);

        animationTimeoutRef.current = window.setTimeout(() => {
          setDisplayedText(content.slice(0, displayedText.length + 1));
        }, speed);
      } else {
        debounceTimeoutRef.current = window.setTimeout(() => {
          if (messageId) {
            stopTyping(messageId);
          }
        }, 500);
      }
    } else {
      setDisplayedText(content);
    }
  }, [content, displayedText, sender, isTyping, messageId, stopTyping]);

  return (
    <div className={styles.root} data-sender={sender}>
      <div className={styles.bubble} data-sender={sender}>
        <div className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText || ' '}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

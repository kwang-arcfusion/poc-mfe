// packages/ui/src/components/Chat/ChatMessage.tsx
import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

export function ChatMessage({ sender, content }: ChatMessageProps) {
  const styles = useStyles();

  return (
    <div className={styles.root} data-sender={sender}>
      <div className={styles.bubble} data-sender={sender}>
        <div className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

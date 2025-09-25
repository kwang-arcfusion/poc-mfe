import React from 'react';
import { makeStyles, shorthands, tokens } from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    width: 'fit-content',
    flexDirection: 'column',
    '&[data-sender="user"]': {
      alignSelf: 'flex-end',
      alignItems: 'flex-end',
      maxWidth: '70%',
    },
    '&[data-sender="ai"]': {
      alignSelf: 'flex-start',
      alignItems: 'flex-start',
      maxWidth: '100%',
    },
  },
  bubble: {
    ...shorthands.padding(tokens.spacingVerticalM, tokens.spacingHorizontalL),
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    wordWrap: 'break-word',
    '&[data-sender="user"]': {
      backgroundColor: tokens.colorNeutralStroke3,
      color: tokens.colorNeutralForeground1,
    },
    '&[data-sender="ai"]': {
      backgroundColor: tokens.colorNeutralBackground2,
      color: tokens.colorNeutralForeground1,
      paddingLeft: 0,
    },
  },
  markdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    lineHeight: 2,
    '& p': { marginTop: 0, marginBottom: 0 },
    '& ul, & ol': {
      ...shorthands.padding(0, 0, 0, tokens.spacingHorizontalL),
      ...shorthands.margin(0),
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    '& li': { marginBottom: tokens.spacingVerticalXS },
    '& strong': {
      backgroundColor: tokens.colorPaletteDarkOrangeBackground1,
      paddingLeft: '5px',
      paddingRight: '5px',
      paddingTop: '3px',
      paddingBottom: '3px',
      borderRadius: '6px',
    },
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
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || ' '}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

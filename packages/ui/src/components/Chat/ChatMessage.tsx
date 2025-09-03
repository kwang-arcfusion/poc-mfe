// packages/ui/src/components/Chat/ChatMessage.tsx
import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Tooltip,
} from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ThumbLike24Regular,
  ThumbLike24Filled,
  ThumbDislike24Regular,
  ThumbDislike24Filled,
} from '@fluentui/react-icons';
import { submitFeedback, deleteFeedback } from '@arcfusion/client';
import { FeedbackType } from '@arcfusion/types';

// ... (Styles เหมือนเดิม) ...
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
  feedbackContainer: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    marginTop: tokens.spacingVerticalXL,
  },
});

interface ChatMessageProps {
  sender: 'user' | 'ai';
  content: string;
  messageId?: string;
}

export function ChatMessage({ sender, content, messageId }: ChatMessageProps) {
  const styles = useStyles();
  const [feedbackState, setFeedbackState] = useState<FeedbackType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (newFeedback: FeedbackType) => {
    if (!messageId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (feedbackState === newFeedback) {
        await deleteFeedback(messageId);
        setFeedbackState(null);
      } else {
        await submitFeedback({
          message_id: messageId,
          feedback_type: newFeedback,
        });
        setFeedbackState(newFeedback);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.root} data-sender={sender}>
      <div className={styles.bubble} data-sender={sender}>
        <div className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        {sender === 'ai' && messageId && content && (
          <div className={styles.feedbackContainer}>
            <Tooltip content="Good response" relationship="label">
              <Button
                appearance="subtle"
                size="small"
                disabled={isSubmitting}
                icon={feedbackState === 'thumb_up' ? <ThumbLike24Filled /> : <ThumbLike24Regular />}
                onClick={() => handleFeedback('thumb_up')}
              />
            </Tooltip>
            <Tooltip content="Bad response" relationship="label">
              <Button
                appearance="subtle"
                size="small"
                disabled={isSubmitting}
                icon={
                  feedbackState === 'thumb_down' ? (
                    <ThumbDislike24Filled />
                  ) : (
                    <ThumbDislike24Regular />
                  )
                }
                onClick={() => handleFeedback('thumb_down')}
              />
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}
// remotes/ask_ai/src/components/ChatMessage.tsx
import React, { useState } from 'react'; // ✨ Import useState
import {
  makeStyles,
  shorthands,
  tokens,
  Button, // ✨ Import Button
  Tooltip, // ✨ Import Tooltip
} from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// ✨ START: Import เพิ่มเติมสำหรับ Feedback ✨
import {
  ThumbLike24Regular,
  ThumbLike24Filled,
  ThumbDislike24Regular,
  ThumbDislike24Filled,
} from '@fluentui/react-icons';
import { submitFeedback, deleteFeedback } from '@arcfusion/client';
import { FeedbackType } from '@arcfusion/types';
// ✨ END: Import เพิ่มเติมสำหรับ Feedback ✨

const useStyles = makeStyles({
  root: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalM),
    maxWidth: '85%',
    width: 'fit-content',
    flexDirection: 'column', // ✨ ปรับเป็น column เพื่อให้ปุ่ม Feedback อยู่ข้างใต้
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
      backgroundColor: tokens.colorNeutralBackground1,
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
  // ✨ START: เพิ่ม Style สำหรับส่วน Feedback ✨
  feedbackContainer: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    marginTop: tokens.spacingVerticalXL,
  },
  // ✨ END: เพิ่ม Style สำหรับส่วน Feedback ✨
});

interface ChatMessageProps {
  sender: 'user' | 'ai';
  content: string;
  messageId?: string; // ✨ เพิ่ม Prop นี้เพื่อรับ ID ของข้อความ
}

export function ChatMessage({ sender, content, messageId }: ChatMessageProps) {
  const styles = useStyles();

  // ✨ START: เพิ่ม State และ Logic สำหรับ Feedback ✨
  const [feedbackState, setFeedbackState] = useState<FeedbackType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (newFeedback: FeedbackType) => {
    if (!messageId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // ถ้ากดปุ่มเดิมซ้ำ (เป็นการยกเลิก)
      if (feedbackState === newFeedback) {
        await deleteFeedback(messageId);
        setFeedbackState(null);
      } else {
        // ถ้ากดปุ่มใหม่ (เป็นการส่ง/อัปเดต)
        await submitFeedback({
          message_id: messageId,
          feedback_type: newFeedback,
        });
        setFeedbackState(newFeedback);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      // อาจจะแสดง Error UI ที่นี่
    } finally {
      setIsSubmitting(false);
    }
  };
  // ✨ END: เพิ่ม State และ Logic สำหรับ Feedback ✨

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

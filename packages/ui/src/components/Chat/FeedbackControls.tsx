// packages/ui/src/components/Chat/FeedbackControls.tsx
import React, { useState } from 'react';
import { makeStyles, shorthands, tokens, Button, Tooltip } from '@fluentui/react-components';
import {
  ThumbLike24Regular,
  ThumbLike24Filled,
  ThumbDislike24Regular,
  ThumbDislike24Filled,
} from '@fluentui/react-icons';
import { submitFeedback, deleteFeedback } from '@arcfusion/client';
import type { FeedbackType } from '@arcfusion/types';
import { FeedbackDialog } from './FeedbackDialog';

const useStyles = makeStyles({
  feedbackContainer: {
    display: 'flex',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    marginTop: tokens.spacingVerticalL,
  },
});

interface FeedbackControlsProps {
  messageId?: string;
}

export function FeedbackControls({ messageId }: FeedbackControlsProps) {
  const styles = useStyles();
  const [feedbackState, setFeedbackState] = useState<FeedbackType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // ถ้าไม่มี messageId ก็ไม่ต้องแสดงผล Component นี้เลย
  if (!messageId) {
    return null;
  }

  const handleFeedback = async (newFeedback: FeedbackType) => {
    if (isSubmitting) return;

    if (newFeedback === 'thumb_down' && feedbackState !== 'thumb_down') {
      setIsReportDialogOpen(true);
      return;
    }

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

  const handleReportSubmit = async (reasons: string[], details: string) => {
    setIsSubmitting(true);
    try {
      await submitFeedback({
        message_id: messageId,
        feedback_type: 'thumb_down',
        reason: reasons.join(', '),
        details: details,
      });
      setFeedbackState('thumb_down');
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              feedbackState === 'thumb_down' ? <ThumbDislike24Filled /> : <ThumbDislike24Regular />
            }
            onClick={() => handleFeedback('thumb_down')}
          />
        </Tooltip>
      </div>
      <FeedbackDialog
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}

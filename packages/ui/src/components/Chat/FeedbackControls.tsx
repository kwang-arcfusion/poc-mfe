// packages/ui/src/components/Chat/FeedbackControls.tsx

import React, { useState, useEffect } from 'react'; // ✨ เพิ่ม useEffect
import { makeStyles, shorthands, tokens, Button, Tooltip } from '@fluentui/react-components';
import {
  ThumbLike24Regular,
  ThumbLike24Filled,
  ThumbDislike24Regular,
  ThumbDislike24Filled,
} from '@fluentui/react-icons';
import { submitFeedback, deleteFeedback } from '@arcfusion/client';
import type { FeedbackType, FeedbackResponse } from '@arcfusion/types'; // ✨ Import Type ที่เกี่ยวข้อง
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
  initialFeedback?: FeedbackResponse | null; // ✨ เพิ่ม prop นี้
}

export function FeedbackControls({ messageId, initialFeedback }: FeedbackControlsProps) {
  const styles = useStyles();

  // ✨ กำหนดค่าเริ่มต้นของ state จาก prop ที่ได้รับมา
  const [feedbackState, setFeedbackState] = useState<FeedbackType | null>(
    () => initialFeedback?.feedback_type || null
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  // ✨ เพิ่ม useEffect เพื่ออัปเดต state หาก prop เปลี่ยนแปลง (เช่น ข้อมูลโหลดมาทีหลัง)
  useEffect(() => {
    setFeedbackState(initialFeedback?.feedback_type || null);
  }, [initialFeedback]);

  if (!messageId) {
    return null;
  }

  // ... ส่วน logic ของ handleFeedback และ handleReportSubmit เหมือนเดิม ...
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
// packages/ui/src/components/Chat/FeedbackControls.tsx

import React, { useState, useEffect } from 'react';
import { makeStyles, shorthands, tokens, Button, Tooltip } from '@fluentui/react-components';
import {
  ThumbLike24Regular,
  ThumbLike24Filled,
  ThumbDislike24Regular,
  ThumbDislike24Filled,
  ArrowDownload24Regular,
} from '@fluentui/react-icons';
import { submitFeedback, deleteFeedback, getExportPdfUrl } from '@arcfusion/client';
import type { FeedbackType, FeedbackResponse } from '@arcfusion/types';
import { FeedbackDialog } from './FeedbackDialog';

const useStyles = makeStyles({
  feedbackContainer: {
    display: 'flex',
    // ✨ เพิ่ม alignItems: 'center' เพื่อให้ปุ่มที่มีข้อความแสดงผลสวยงาม
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    gap: '6px',
  },
  exportToPdfButton: {
    marginLeft: '6px',
  },
});

interface FeedbackControlsProps {
  messageId?: string;
  initialFeedback?: FeedbackResponse | null;
  showExport?: boolean; //
  hasAssets?: boolean; //
}

export function FeedbackControls({
  messageId,
  initialFeedback,
  showExport,
  hasAssets,
}: FeedbackControlsProps) {
  const styles = useStyles();
  const [feedbackState, setFeedbackState] = useState<FeedbackType | null>(
    () => initialFeedback?.feedback_type || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  useEffect(() => {
    setFeedbackState(initialFeedback?.feedback_type || null);
  }, [initialFeedback]);

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

  const handleExportPdf = () => {
    if (!messageId) {
      console.error('Cannot export PDF: messageId is missing.');
      return;
    }
    const url = getExportPdfUrl(messageId);
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <div
        className={styles.feedbackContainer}
        style={{ marginTop: hasAssets ? tokens.spacingVerticalL : 0 }}
      >
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

        {showExport && (
          <Button
            className={styles.exportToPdfButton}
            appearance="outline"
            size="small"
            icon={<ArrowDownload24Regular />}
            onClick={handleExportPdf}
          >
            Export to PDF
          </Button>
        )}
      </div>
      <FeedbackDialog
        open={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </>
  );
}

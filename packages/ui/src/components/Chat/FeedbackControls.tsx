// packages/ui/src/components/Chat/FeedbackControls.tsx

import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  tokens,
  Button,
  Tooltip,
  Spinner, // 1. Import Spinner
  mergeClasses, // 2. Import mergeClasses
} from '@fluentui/react-components';
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
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalXS),
    gap: '6px',
  },
  exportToPdfButton: {
    marginLeft: '6px',
  },
  // 3. สร้าง Class สำหรับจัดการ Margin Top
  withAssetsTopMargin: {
    marginTop: tokens.spacingVerticalL,
  },
});

interface FeedbackControlsProps {
  messageId?: string;
  initialFeedback?: FeedbackResponse | null;
  showExport?: boolean;
  hasAssets?: boolean;
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
  const [isExporting, setIsExporting] = useState(false); // 4. เพิ่ม State สำหรับจัดการสถานะ Export

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

  // 5. แทนที่ handleExportPdf ด้วย Logic ใหม่ทั้งหมด
  const handleExportPdf = async () => {
    if (!messageId || isExporting) {
      return;
    }

    setIsExporting(true);
    try {
      const url = getExportPdfUrl(messageId);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `export-${messageId}.pdf`); // ตั้งชื่อไฟล์
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export PDF failed:', error);
      // ในอนาคตอาจจะแสดง Toast แจ้งเตือนผู้ใช้ว่า error ตรงนี้
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div
        // 6. ใช้ mergeClasses แทน inline style เพื่อความสะอาดของโค้ด
        className={mergeClasses(styles.feedbackContainer, hasAssets && styles.withAssetsTopMargin)}
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
          // 7. อัปเดตปุ่มให้แสดงสถานะ Loading
          <Button
            className={styles.exportToPdfButton}
            appearance="outline"
            size="small"
            icon={isExporting ? <Spinner size="tiny" /> : <ArrowDownload24Regular />}
            onClick={handleExportPdf}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export to PDF'}
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

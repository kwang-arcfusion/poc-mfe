// packages/ui/src/components/Chat/FeedbackDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  Button,
  Checkbox,
  Textarea,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
    paddingTop: tokens.spacingVerticalM,
  },
  title: {
    paddingBottom: '0px',
  },
  dialogBody: {
    display: 'flex !important',
    flexDirection: 'column',
    gridTemplate: 'none',
  },
  // แก้ไขชื่อคลาสเพื่อความถูกต้อง
  dialogAction: {
    marginTop: '18px',
    display: 'flex !important',
    justifyContent: 'flex-end',
  },
});

const REPORT_REASONS = [
  "Query doesn't match the expected results",
  'SQL syntax is incorrect',
  'Missing or incorrect table joins',
  'Wrong aggregation or grouping',
  'Data type mismatch in conditions',
  'Other',
];

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reasons: string[], details: string) => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ open, onClose, onSubmit }) => {
  const styles = useStyles();
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [details, setDetails] = useState('');

  // สร้างตัวแปร boolean เพื่อเช็คว่า 'Other' ถูกเลือกหรือไม่
  const isOtherSelected = selectedReasons.includes('Other');

  const handleCheckboxChange = (reason: string, checked: boolean) => {
    setSelectedReasons((prev) => (checked ? [...prev, reason] : prev.filter((r) => r !== reason)));

    // ถ้า uncheck 'Other' ให้ล้างค่า details
    if (reason === 'Other' && !checked) {
      setDetails('');
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedReasons, details);
    onClose();
  };

  React.useEffect(() => {
    // Reset state ทั้งหมดเมื่อ Dialog ปิด
    if (!open) {
      setSelectedReasons([]);
      setDetails('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface>
        <DialogBody className={styles.dialogBody}>
          <DialogTitle className={styles.title}> Report an Issue</DialogTitle>
          <div className={styles.body}>
            {REPORT_REASONS.map((reason) => (
              <Checkbox
                key={reason}
                label={reason}
                checked={selectedReasons.includes(reason)} // ทำให้เป็น Controlled Component
                onChange={(_, data) => handleCheckboxChange(reason, !!data.checked)}
              />
            ))}

            {/* แสดง Textarea ก็ต่อเมื่อ 'Other' ถูกเลือก */}
            {isOtherSelected && (
              <Textarea
                placeholder="Please provide more details about the issue..."
                value={details}
                onChange={(_, data) => setDetails(data.value)}
                resize="vertical"
              />
            )}
          </div>
          <DialogActions className={styles.dialogAction}>
            <Button appearance="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              onClick={handleSubmit}
              disabled={selectedReasons.length === 0}
            >
              Submit Report
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

// packages/ui/src/components/Chat/InitialView.tsx
import * as React from 'react';
import { makeStyles, Title3, Button, tokens, shorthands } from '@fluentui/react-components';
// ❌ ลบการ import icon ที่เคย hardcode ออก

const useStyles = makeStyles({
  initialViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    ...shorthands.gap('24px'),
    height: '100%',
  },
  // ✨ Style นี้จะถูกนำไปใช้กับ wrapper ของ icon ที่รับเข้ามา
  iconContainer: {
    color: tokens.colorBrandForeground1,
  },
  title: {
    color: tokens.colorNeutralForeground1,
  },
  suggestionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    maxWidth: '620px',
  },
  buttonStartConversation: {
    color: tokens.colorBrandForeground1,
    fontSize: tokens.fontSizeBase200,
    ...shorthands.borderColor(tokens.colorBrandStroke1),
    ':hover': {
      color: tokens.colorBrandForeground1,
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
});

// 👈 1. กำหนดค่าเริ่มต้นสำหรับ Title (Starters จะไม่มี่ค่า default แล้ว)
const DEFAULT_TITLE = 'Finding the fresh insights today?';

// 👈 2. อัปเดต Interface สำหรับ Props ใหม่
interface InitialViewProps {
  icon: React.ReactNode; // บังคับให้ส่ง icon เข้ามา
  starters: string[]; // บังคับให้ส่ง starters เข้ามา
  title?: string; // title ยังคงเป็น optional
  onSuggestionClick: (text: string) => void;
}

export function InitialView({
  icon, // 👈 3. รับ icon และ starters เข้ามา
  starters,
  title = DEFAULT_TITLE,
  onSuggestionClick,
}: InitialViewProps) {
  const styles = useStyles();
  return (
    <div className={styles.initialViewContainer}>
      {/* 👈 4. แสดงผล icon ที่ได้รับมาจาก prop */}
      <div className={styles.iconContainer}>{icon}</div>

      <Title3 as="h1" className={styles.title}>
        {title}
      </Title3>
      <div className={styles.suggestionsContainer}>
        {starters.map((text, index) => (
          <Button
            className={styles.buttonStartConversation}
            key={index}
            appearance="secondary"
            onClick={() => onSuggestionClick(text)}
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}
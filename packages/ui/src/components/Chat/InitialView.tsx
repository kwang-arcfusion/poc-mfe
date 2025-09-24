// packages/ui/src/components/Chat/InitialView.tsx
import * as React from 'react';
import { makeStyles, Title3, Button, tokens, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  initialViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    ...shorthands.gap('24px'),
    height: '100%',
    paddingLeft: '6px',
    paddingRight: '6px',
  },
  iconContainer: {
    color: tokens.colorBrandForeground1,
  },
  title: {
    color: tokens.colorNeutralForeground1,
  },
  suggestionsContainer: {
    display: 'grid', // ✨ 1. เปลี่ยนจาก flex เป็น grid
    gridTemplateColumns: 'repeat(2, 1fr)', // ✨ 2. กำหนดให้มี 2 คอลัมน์
    ...shorthands.gap('12px'),
    maxWidth: '460px', // ✨ 3. (แนะนำ) เพิ่มความกว้างสูงสุดเพื่อให้ปุ่มไม่เบียดกันเกินไป
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

const DEFAULT_TITLE = 'Finding the fresh insights today?';

interface InitialViewProps {
  icon: React.ReactNode;
  starters: string[];
  title?: string;
  onSuggestionClick: (text: string) => void;
}

export function InitialView({
  icon,
  starters,
  title = DEFAULT_TITLE,
  onSuggestionClick,
}: InitialViewProps) {
  const styles = useStyles();
  return (
    <div className={styles.initialViewContainer}>
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

import * as React from 'react';
import { makeStyles, Title3, Badge, tokens, shorthands, Button } from '@fluentui/react-components';
import { SearchSparkle48Color } from '@fluentui/react-icons';

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
  icon: { color: tokens.colorBrandForeground1 },
  title: { color: tokens.colorNeutralForeground1 },
  suggestionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    maxWidth: '620px',
  },
  buttonStartConversation: {
    // --- สถานะปกติ ---
    color: tokens.colorBrandForeground1, // สีตัวอักษร
    fontSize: tokens.fontSizeBase200,
    ...shorthands.borderColor(tokens.colorBrandStroke1), // สีขอบ

    // --- ตอนเมาส์ชี้ (Hover) ---
    ':hover': {
      color: tokens.colorBrandForeground1, // เปลี่ยนสีตัวอักษรเพื่อให้อ่านง่ายขึ้น
      backgroundColor: tokens.colorNeutralBackground4,
    },
  },
});

const conversationStarters = [
  'What changed in CTR last week?',
  'Which creatives drove conversions?',
  'Highlight underperforming campaigns.',
  'Summarize performance by channel.',
];

export function InitialView({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  const styles = useStyles();
  return (
    <div className={styles.initialViewContainer}>
      <SearchSparkle48Color className={styles.icon} />
      <Title3 as="h1" className={styles.title}>
        Finding the fresh insights today?
      </Title3>
      <div className={styles.suggestionsContainer}>
        {conversationStarters.map((text, index) => (
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

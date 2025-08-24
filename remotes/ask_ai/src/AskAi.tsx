import React from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Textarea,
  Button,
  Title3,
  Body1,
  Badge,
} from '@fluentui/react-components';
import { SearchSparkle48Color, Send24Filled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    ...shorthands.padding('20px'),
    ...shorthands.gap('24px'),
  },
  icon: {
    scale: 2,
  },
  title: {
    color: tokens.colorBrandForeground1,
  },
  suggestionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('12px'),
    maxWidth: '700px',
  },
  suggestionButton: {
    // ใช้สำหรับ Badge/Pill look
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    width: '100%',
    maxWidth: '600px',
    position: 'relative',
    paddingTop: '24px',
  },
  textarea: {
    width: '100%',
    // ทำให้มี padding ด้านขวาเพื่อไม่ให้ text ทับกับปุ่ม
    paddingRight: '50px',
  },
  sendButton: {
    position: 'absolute',
    right: '8px',
    top: '50%',
    transform: 'translateY(-12%)', // ขยับให้เข้ากลาง textarea
  },
});

const conversationStarters = [
  'What changed in CTR last week?',
  'Which creatives drove conversions?',
  'Highlight underperforming campaigns.',
  'Summarize performance by channel.',
];

export default function AskAi() {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      {/* Icon และ Title */}
      <SearchSparkle48Color className={styles.icon} />
      <Title3 as="h1" className={styles.title}>
        Finding the fresh insights today?
      </Title3>

      {/* Suggestion Buttons */}
      <div className={styles.suggestionsContainer}>
        {conversationStarters.map((text) => (
          <Badge size="extra-large" appearance="tint">
            {text}
          </Badge>
        ))}
      </div>

      {/* Input Area */}
      <div className={styles.inputContainer}>
        <Textarea
          resize="none"
          placeholder="Ask Anything..."
          className={styles.textarea}
          size="large"
        />
        <Button
          appearance="transparent"
          icon={<Send24Filled primaryFill={tokens.colorBrandForeground1} />}
          className={styles.sendButton}
          aria-label="Send message"
        />
      </div>
    </div>
  );
}

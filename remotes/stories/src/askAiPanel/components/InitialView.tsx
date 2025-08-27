// remotes/stories/src/askAiPanel/components/InitialView.tsx
import * as React from 'react';
import { makeStyles, Title3, tokens, shorthands, Button } from '@fluentui/react-components';
import { Sparkle24Filled, Sparkle48Filled } from '@fluentui/react-icons';

const useStyles = makeStyles({
  initialViewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    ...shorthands.gap('16px'),
    height: '100%',
    ...shorthands.padding('16px'),
    boxSizing: 'border-box',
  },
  icon: { color: tokens.colorBrandForeground1 },
  title: { color: tokens.colorNeutralForeground1 },
  suggestionsContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
    width: '100%',
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

// Conversation starters ที่เกี่ยวข้องกับ Story
const conversationStarters = [
  'Summarize the key issue.',
  'What was the financial impact?',
  'Suggest 3 actions to take.',
  'Draft an email to the team.',
];

export function InitialView({ onSuggestionClick }: { onSuggestionClick: (text: string) => void }) {
  const styles = useStyles();
  return (
    <div className={styles.initialViewContainer}>
      <Sparkle48Filled className={styles.icon} />
      <Title3 as="h1" className={styles.title}>
        Ask AI about this story
      </Title3>
      <div className={styles.suggestionsContainer}>
        {conversationStarters.map((text, index) => (
          <Button
            className={styles.buttonStartConversation}
            key={index}
            appearance="secondary"
            size="small"
            onClick={() => onSuggestionClick(text)}
          >
            {text}
          </Button>
        ))}
      </div>
    </div>
  );
}

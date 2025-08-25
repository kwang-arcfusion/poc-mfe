import * as React from 'react';
import { makeStyles, Title3, Badge, tokens, shorthands } from '@fluentui/react-components';
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
          <Badge
            key={index}
            size="extra-large"
            appearance="ghost"
            onClick={() => onSuggestionClick(text)}
          >
            {text}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// packages/ui/src/components/Chat/AiStatusIndicator.tsx
import React from 'react';
import { makeStyles, shorthands, tokens, Spinner, Body1 } from '@fluentui/react-components';

const useStatusStyles = makeStyles({
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground3,
  },
});

export const TASK_DISPLAY_TEXT: Record<string, string> = {
  thinking: 'Thinking',
  'creating sql': 'Creating SQL',
  'creating table': 'Creating Table',
  'creating chart': 'Creating Chart',
  answering: 'Answering',
};

export const AiStatusIndicator = ({ task }: { task: string | null }) => {
  const styles = useStatusStyles();
  if (!task) return null;
  const displayText = TASK_DISPLAY_TEXT[task] || 'Processing';
  return (
    <div className={styles.statusContainer}>
      <Spinner size="tiny" />
      <Body1>{displayText}...</Body1>
    </div>
  );
};

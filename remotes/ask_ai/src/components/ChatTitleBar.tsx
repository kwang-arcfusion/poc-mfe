// remotes/ask_ai/src/components/ChatTitleBar.tsx
import React from 'react';
import { Button, makeStyles, shorthands, tokens, Body1Strong } from '@fluentui/react-components';
import {
  PenSparkle24Regular,
  Bookmark24Regular,
  BookmarkAdd24Regular,
  ArrowExportLtr24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    ...shorthands.padding(0, tokens.spacingHorizontalXXXL),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke2),
    paddingBottom: tokens.spacingHorizontalXS,
    boxSizing: 'border-box',
    position: 'sticky',
    top: 0,
    backgroundColor: tokens.colorNeutralBackground2,
    zIndex: 1,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
    color: tokens.colorNeutralForeground1,
  },
  actionsContainer: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap(tokens.spacingHorizontalS),
  },
  brandButton: {
    color: tokens.colorBrandForeground1, // ข้อความ + icon
  },
});

interface ChatTitleBarProps {
  title: string;
}

export function ChatTitleBar({ title }: ChatTitleBarProps) {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <PenSparkle24Regular />
        <Body1Strong>{title}</Body1Strong>
      </div>
      <div className={styles.actionsContainer}>
        <Button appearance="secondary" icon={<BookmarkAdd24Regular />}>
          Add to Bookmark
        </Button>
        <Button appearance="primary" icon={<ArrowExportLtr24Regular />}>
          Export this file
        </Button>
      </div>
    </div>
  );
}

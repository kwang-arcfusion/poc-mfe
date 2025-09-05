import React from 'react';
import { makeStyles, tokens, Avatar, SearchBox } from '@fluentui/react-components';
import { Alert24Regular } from '@fluentui/react-icons';
import { UserMenu, type UserMenuProps } from '../UserMenu';
import { ChatHistoryPopover } from '../ChatHistoryPopover';

const useStyles = makeStyles({
  root: {
    height: '60px',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalXXL}`,
    gap: tokens.spacingHorizontalL,
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    whiteSpace: 'nowrap',
  },
  middleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    gap: tokens.spacingHorizontalM,
    minWidth: 0,
  },
  methodsLeft: {
    display: 'flex',
    flexGrow: 1,
    minWidth: 0,
    gap: tokens.spacingHorizontalS,
  },
  methodsRight: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexShrink: 0,
  },
  rightContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
});

export interface TopbarProps extends UserMenuProps {
  pageTitle: string;
  methodsLeft?: React.ReactNode;
  methodsRight?: React.ReactNode;
}

export function Topbar({
  pageTitle,
  methodsLeft,
  methodsRight,
  user,
  onLogout,
}: TopbarProps) {
  const styles = useStyles();

  return (
    <header className={styles.root}>
      <div className={styles.pageTitle}>{pageTitle}</div>
      <div className={styles.middleContainer}>
        <div className={styles.methodsLeft}>{methodsLeft}</div>
        <div className={styles.methodsRight}>{methodsRight}</div>
      </div>
      <div className={styles.rightContainer}>
        <SearchBox placeholder="Search" />
        <ChatHistoryPopover />
        <Alert24Regular color={tokens.colorBrandForeground1}></Alert24Regular>
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}
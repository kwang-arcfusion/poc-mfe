// packages/ui/src/Topbar.tsx
import React from 'react';
import { makeStyles, tokens, Avatar, SearchBox } from '@fluentui/react-components';
import { Chat24Regular, Alert24Regular } from '@fluentui/react-icons';
import { UserMenu, type UserMenuProps } from '../UserMenu';

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
  },
  middleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexGrow: 1,
    gap: tokens.spacingHorizontalM,
  },
  methodsLeft: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  methodsRight: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
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
  user, // <-- รับ user object
  onLogout, // <-- รับ onLogout function
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
        {/* เรียกใช้ UserMenu และส่ง props ที่จำเป็นลงไป */}
        {/* ตรงนี้ */}
        <Chat24Regular color={tokens.colorBrandForeground1}></Chat24Regular>
        <Alert24Regular color={tokens.colorBrandForeground1}></Alert24Regular>
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  );
}

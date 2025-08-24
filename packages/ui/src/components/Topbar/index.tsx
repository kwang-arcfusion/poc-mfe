// packages/ui/src/Topbar.tsx
import React from 'react';
import { makeStyles, tokens, Avatar, SearchBox } from '@fluentui/react-components';
import type { AvatarProps } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    height: '60px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${tokens.spacingHorizontalXXL}`,
    gap: tokens.spacingHorizontalL,
    flexShrink: 0,
  },
  pageTitle: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
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

export interface TopbarProps {
  pageTitle: string;
  userInitials: string;
  userName?: string;
  methodsLeft?: React.ReactNode;
  methodsRight?: React.ReactNode;
}

export function Topbar({
  pageTitle,
  userInitials,
  userName,
  methodsLeft,
  methodsRight,
}: TopbarProps) {
  const styles = useStyles();

  return (
    <header className={styles.root}>
      {/* ซ้ายสุด: Page Name */}
      <div className={styles.pageTitle}>{pageTitle}</div>

      {/* กลาง: Methods (แบ่งซ้าย/ขวา) */}
      <div className={styles.middleContainer}>
        <div className={styles.methodsLeft}>{methodsLeft}</div>
        <div className={styles.methodsRight}>{methodsRight}</div>
      </div>

      {/* ขวาสุด: Search + Avatar */}
      <div className={styles.rightContainer}>
        <SearchBox placeholder="Search" />
        <Avatar color="brand" name={userName} badge={{ status: 'available' }}>
          {userInitials}
        </Avatar>
      </div>
    </header>
  );
}

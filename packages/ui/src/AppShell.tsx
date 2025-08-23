// packages/ui/src/AppShell.tsx
import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useAppShellStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden', // ป้องกันการซ้อน scrollbar
  },
  mainContent: {
    padding: tokens.spacingHorizontalXXL,
    overflowY: 'auto', // ทำให้ส่วนเนื้อหา scroll ได้
    flexGrow: 1,
  },
});

export interface AppShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ sidebar, topbar, children }: AppShellProps) {
  const styles = useAppShellStyles();

  return (
    <div className={styles.root}>
      {/* ส่วน Sidebar */}
      {sidebar}

      {/* ส่วน Content หลัก (Topbap + Children) */}
      <div className={styles.contentContainer}>
        {topbar}
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}

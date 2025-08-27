// packages/ui/src/AppShell.tsx
import React from 'react';
import {
  makeStyles,
  tokens,
  mergeClasses, // <-- 1. Import mergeClasses
} from '@fluentui/react-components';

// (The imported Sidebar, Topbar, ThemeToggle parts were removed because AppShell should not know them)

// Default styles for AppShell
const useAppShellStyles = makeStyles({
  root: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
    boxShadow: tokens.shadow16,
  },
  mainContent: {
    overflowY: 'auto',
    flexGrow: 1,
  },
});

// 2. Define type for the classNames prop
export type AppShellClassNames = {
  root?: string;
  contentContainer?: string;
  mainContent?: string;
};

export interface AppShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
  classNames?: AppShellClassNames; // <-- Add new prop
}

export function AppShell({ sidebar, topbar, children, classNames }: AppShellProps) {
  const styles = useAppShellStyles();

  return (
    // 3. Use mergeClasses to combine default classes with provided classes
    <div className={mergeClasses(styles.root, classNames?.root)}>
      {sidebar}
      <div className={mergeClasses(styles.contentContainer, classNames?.contentContainer)}>
        {topbar}
        <main className={mergeClasses(styles.mainContent, classNames?.mainContent)}>
          {children}
        </main>
      </div>
    </div>
  );
}

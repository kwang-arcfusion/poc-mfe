import React from 'react';
import { makeStyles, tokens, mergeClasses } from '@fluentui/react-components';
import { useLayoutStore } from '@arcfusion/store';

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

export type AppShellClassNames = {
  root?: string;
  contentContainer?: string;
  mainContent?: string;
};

export interface AppShellProps {
  sidebar: React.ReactNode;
  topbar: React.ReactNode;
  children: React.ReactNode;
  classNames?: AppShellClassNames;
}

export function AppShell({ sidebar, topbar, children, classNames }: AppShellProps) {
  const styles = useAppShellStyles();
  const { mainOverflow } = useLayoutStore();

  return (
    <div className={mergeClasses(styles.root, classNames?.root)}>
      {sidebar}
      <div className={mergeClasses(styles.contentContainer, classNames?.contentContainer)}>
        {topbar}
        <main
          className={mergeClasses(styles.mainContent, classNames?.mainContent)}
          style={{ overflowY: mainOverflow }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

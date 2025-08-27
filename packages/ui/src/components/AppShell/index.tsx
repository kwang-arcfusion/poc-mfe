// packages/ui/src/components/AppShell/index.tsx
import React from 'react';
import { makeStyles, tokens, mergeClasses } from '@fluentui/react-components';
// 1. Import hook จาก store ที่เราสร้าง
import { useLayoutStore } from '@arcfusion/store';

// ... (โค้ด type และ styles เดิม) ...
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
    overflowY: 'auto', // <-- ค่า overflow เดิมจะมาจาก class นี้
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
  // 2. ดึงค่า overflow และ action มาจาก store
  const { mainOverflow } = useLayoutStore();

  return (
    <div className={mergeClasses(styles.root, classNames?.root)}>
      {sidebar}
      <div className={mergeClasses(styles.contentContainer, classNames?.contentContainer)}>
        {topbar}
        {/* 3. ใช้ inline style เพื่อ override ค่า overflowY */}
        <main
          className={mergeClasses(styles.mainContent, classNames?.mainContent)}
          style={{ overflowY: mainOverflow }} // <-- ✨ จุดสำคัญ ✨
        >
          {children}
        </main>
      </div>
    </div>
  );
}

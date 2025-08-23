// packages/ui/src/Sidebar.tsx
import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    width: '160px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    padding: tokens.spacingVerticalL,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
});

export interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const styles = useStyles();
  return (
    <nav className={styles.root}>
      {/* ในอนาคตเราจะใส่ NavLink ต่างๆ ไว้ตรงนี้ */}
      {children || (
        <>
          <div>Sidebar</div>
          <div>Navigation Item 1</div>
          <div>Navigation Item 2</div>
        </>
      )}
    </nav>
  );
}

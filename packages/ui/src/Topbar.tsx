// packages/ui/src/Topbar.tsx
import React from 'react';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  root: {
    height: '60px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: tokens.spacingHorizontalXXL,
    paddingRight: tokens.spacingHorizontalXXL,
    flexShrink: 0, // ป้องกันไม่ให้ Topbar หดตัว
  },
});

export interface TopbarProps {
  children?: React.ReactNode;
}

export function Topbar({ children }: TopbarProps) {
  const styles = useStyles();
  return <header className={styles.root}>{children}</header>;
}

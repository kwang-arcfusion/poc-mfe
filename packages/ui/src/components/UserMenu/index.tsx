import React, { useState } from 'react';

import {
  Avatar,
  Button,
  Dialog,
  DialogBody,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  makeStyles,
  shorthands,
  tokens,
  Card,
  DialogActions,
} from '@fluentui/react-components';
import { useThemeStore } from '@arcfusion/store';
import { SignOut24Regular, Color24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';

export interface UserMenuProps {
  user?: { name?: string | null; email?: string | null };
  onLogout: () => void;
}

const getInitials = (name?: string | null) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

type ThemeName = 'light' | 'dark';

const useStyles = makeStyles({
  fitContentSurface: {
    width: 'fit-content',
    minWidth: '520px',
    maxWidth: '680px',
  },
  pointerCursor: { cursor: 'pointer' },

  dialogBody: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalM,
    width: '100%',
  },

  themeCard: {
    ...shorthands.padding(tokens.spacingVerticalM),
    position: 'relative',
    transitionProperty: 'transform, box-shadow, outline-color',
    transitionDuration: '120ms',
    ...shorthands.borderRadius(tokens.borderRadiusXLarge),
    outlineStyle: 'solid',
    outlineWidth: '2px',
    outlineColor: 'transparent',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow16,
    },
    ':focus-within': {
      outlineColor: tokens.colorStrokeFocus2,
    },
  },
  selected: {
    outlineColor: tokens.colorBrandForeground1,
    boxShadow: tokens.shadow28,
  },
  checkIcon: {
    position: 'absolute',
    top: tokens.spacingVerticalS,
    right: tokens.spacingHorizontalS,
  },

  previewRoot: {
    width: '100%',
    height: '180px',
    ...shorthands.borderRadius(tokens.borderRadiusLarge),
    overflow: 'hidden',
    display: 'grid',
    gridTemplateRows: '36px 1fr',
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
  },
  topBar: { width: '100%' },
  previewContent: {
    display: 'grid',
    gridTemplateColumns: '140px 1fr',
    columnGap: '12px',
    padding: '12px',
    alignItems: 'start',
  },
  sideRail: {
    height: '100%',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  contentCard: {
    height: '100%',
    display: 'grid',
    gridTemplateRows: '24px 1fr',
    rowGap: '8px',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.border('1px', 'solid', 'transparent'),
  },
  line: {
    height: '8px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    width: '60%',
  },
  chipsRow: { display: 'flex', columnGap: '8px' },
  chip: {
    height: '18px',
    width: '48px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
  cardLabel: {
    marginTop: tokens.spacingVerticalS,
    fontWeight: 600,
  },

  growList: { flexGrow: 1, width: '100%' },
});

const LIGHT_PALETTE = {
  bg: '#F6F7FB',
  surface: '#FFFFFF',
  border: '#E6E8EF',
  text: '#1C1F29',
  subtleText: '#6B7280',
  accent: '#4F6BED',
  rail: '#EEF0F6',
  topbar: '#EEF2FF',
  chip: '#E3E8FF',
};

const DARK_PALETTE = {
  bg: '#0F1115',
  surface: '#171A22',
  border: '#2A2F3C',
  text: '#E7EAF2',
  subtleText: '#9AA2B1',
  accent: '#7AA2FF',
  rail: '#1E232E',
  topbar: '#111826',
  chip: '#25314A',
};

function ThemePreview({
  palette,
  selected,
  label,
  onApply,
}: {
  palette: typeof LIGHT_PALETTE;
  selected: boolean;
  label: string;
  onApply: () => void;
}) {
  const styles = useStyles();

  return (
    <Card
      role="button"
      aria-pressed={selected}
      tabIndex={0}
      className={`${styles.themeCard} ${selected ? styles.selected : ''}`}
      onClick={onApply}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onApply();
        }
      }}
      title={selected ? `Current: ${label}` : `Switch to ${label}`}
    >
      {selected && (
        <div className={styles.checkIcon} aria-hidden>
          <CheckmarkCircle24Regular />
        </div>
      )}

      <div
        className={styles.previewRoot}
        style={{ background: palette.bg, borderColor: palette.border }}
      >
        <div
          className={styles.topBar}
          style={{ background: palette.topbar, borderBottom: `1px solid ${palette.border}` }}
        />
        <div className={styles.previewContent}>
          {/* Left rail */}
          <div className={styles.sideRail} style={{ background: palette.rail }} />
          {/* Right content */}
          <div
            className={styles.contentCard}
            style={{ background: palette.surface, borderColor: palette.border, padding: 12 }}
          >
            <div className={styles.chipsRow}>
              <div className={styles.chip} style={{ background: palette.chip }} />
              <div className={styles.chip} style={{ background: palette.chip }} />
              <div className={styles.chip} style={{ background: palette.chip }} />
            </div>
            <div style={{ display: 'grid', rowGap: 8 }}>
              <div
                className={styles.line}
                style={{ background: palette.text, opacity: 0.9, width: '70%' }}
              />
              <div
                className={styles.line}
                style={{ background: palette.subtleText, opacity: 0.8, width: '85%' }}
              />
              <div
                className={styles.line}
                style={{ background: palette.subtleText, opacity: 0.6, width: '50%' }}
              />
              <div
                className={styles.line}
                style={{ background: palette.accent, opacity: 0.95, width: '40%' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardLabel}>{label}</div>
    </Card>
  );
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const styles = useStyles();

  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const { theme, toggleTheme } = useThemeStore();

  const applyTheme = (target: ThemeName) => {
    if (target !== (theme as ThemeName)) {
      toggleTheme();
    }
  };

  return (
    <>
      {/* MENU */}
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <Avatar
            className={styles.pointerCursor}
            color="brand"
            name={user?.name || undefined}
            aria-label="User menu"
          >
            {getInitials(user?.name)}
          </Avatar>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            {user?.email && <MenuItem disabled>{user.email}</MenuItem>}
            <MenuItem icon={<Color24Regular />} onClick={() => setIsThemeDialogOpen(true)}>
              Change Theme
            </MenuItem>
            <MenuItem icon={<SignOut24Regular />} onClick={() => setIsLogoutDialogOpen(true)}>
              Log out
            </MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>

      {/* THEME DIALOG (click card = apply immediately / no buttons) */}
      <Dialog open={isThemeDialogOpen} onOpenChange={(_e, d) => setIsThemeDialogOpen(d.open)}>
        <DialogSurface className={styles.fitContentSurface}>
          <DialogBody className={styles.dialogBody}>
            <DialogTitle>Select a Theme</DialogTitle>

            <div className={styles.cardGrid} role="listbox" aria-label="Theme options">
              <ThemePreview
                palette={LIGHT_PALETTE}
                selected={(theme as ThemeName) === 'light'}
                label="Light"
                onApply={() => applyTheme('light')}
              />
              <ThemePreview
                palette={DARK_PALETTE}
                selected={(theme as ThemeName) === 'dark'}
                label="Dark"
                onApply={() => applyTheme('dark')}
              />
            </div>

            {/* No DialogActions so the user closes the dialog themselves */}
          </DialogBody>
        </DialogSurface>
      </Dialog>

      {/* LOGOUT DIALOG */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={(_e, d) => setIsLogoutDialogOpen(d.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Confirm Log Out</DialogTitle>
            Are you sure you want to log out?
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Cancel</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={onLogout}>
                Confirm
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
}

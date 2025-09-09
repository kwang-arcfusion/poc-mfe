// packages/ui/src/components/DateRangePicker/index.tsx
import * as React from 'react';
import {
  makeStyles,
  tokens,
  shorthands,
  Button,
  mergeClasses,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from '@fluentui/react-components';
import {
  ArrowRight16Regular,
  DismissCircle20Regular,
  ChevronDown20Regular,
} from '@fluentui/react-icons';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { getDatePresets, getModeFromValue, type Mode } from './dateUtils';

type DateOrNull = Date | null;

export type DateRange = {
  start: DateOrNull;
  end: DateOrNull;
};

export type DateRangePickerProps = {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (next: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  size?: 'medium' | 'small';
  className?: string;
};

const MODE_LABELS: Record<Mode, string> = {
  dateRange: 'Date Range',
  selectDate: 'Select Date',
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This Week',
  lastWeek: 'Last Week',
  thisMonth: 'This Month',
  lastMonth: 'Last Month',
};

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    width: 'fit-content',
  },
  group: {
    height: '26px',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
    ...shorthands.padding(tokens.spacingVerticalXS, tokens.spacingHorizontalS),
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1),
    ':focus-within': {
      outline: `2px solid ${tokens.colorStrokeFocus2}`,
      outlineOffset: '1px',
    },
  },
  field: {},
  arrowRight: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
    paddingLeft: '12px',
    paddingRight: '12px',
    position: 'relative',
    top: '4px',
  },
  clearBtn: {
    flexShrink: 0,
  },
  calendarIcon: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
    marginRight: '6px',
  },
  pickerStart: {
    // Hide the original DatePicker border
    direction: 'rtl',
    '--spacingHorizontalMNudge': '0',
    ...shorthands.border('none'),
    '& input': {
      textAlign: 'left',
      ...shorthands.border('none'),
      ...shorthands.padding('0px'),
      backgroundColor: 'transparent',
      cursor: 'pointer',
      width: '76px',
    },
    '& .fui-Input__contentAfter': {
      paddingRight: '6px',
    },
  },
  pickerEnd: {
    // Hide the original DatePicker border
    '--spacingHorizontalMNudge': '0',
    ...shorthands.border('none'),
    '& input': {
      textAlign: 'left',
      ...shorthands.border('none'),
      ...shorthands.padding('0px'),
      backgroundColor: 'transparent',
      cursor: 'pointer',
      width: '76px',
    },
    // <-- [Edit] Make this selector more specific
    '& .fui-Input__contentAfter': {
      display: 'none',
    },
  },
});

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function maxDate(a?: Date, b?: Date): Date | undefined {
  if (!a) return b;
  if (!b) return a;
  return a.getTime() >= b.getTime() ? a : b;
}

function useControllable<T>(controlled: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = React.useState(defaultValue);
  const isCtrl = controlled !== undefined;
  const value = isCtrl ? (controlled as T) : inner;

  const set = React.useCallback(
    (v: React.SetStateAction<T>) => {
      const next = typeof v === 'function' ? (v as (old: T) => T)(value) : v;
      if (!isCtrl) setInner(next);
      onChange?.(next);
    },
    [isCtrl, onChange, value]
  );
  return [value, set] as const;
}

function patchDatePickerPopupTheme(rootEl: HTMLElement | null) {
  if (!rootEl || !rootEl.ownerDocument) return;
  const provider = rootEl.closest<HTMLElement>('.fui-FluentProvider');
  if (!provider) return;
  const providerClasses = Array.from(provider.classList).filter((c) => c.startsWith('fui-'));
  const applyTo = (el: HTMLElement) => {
    if (!el || el.dataset.themePatched === 'true') return;
    providerClasses.forEach((c) => el.classList.add(c));
    el.dataset.themePatched = 'true';
  };
  rootEl.ownerDocument
    .querySelectorAll<HTMLElement>('[id^="datePicker-popupSurface"]')
    .forEach(applyTo);
  const obs = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof HTMLElement)) return;
        if (n.id?.startsWith('datePicker-popupSurface')) applyTo(n);
        n.querySelectorAll?.('[id^="datePicker-popupSurface"]').forEach((node) =>
          applyTo(node as HTMLElement)
        );
      });
    }
  });
  obs.observe(rootEl.ownerDocument.body, { childList: true, subtree: true });
  window.setTimeout(() => obs.disconnect(), 1500);
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value: valueProp,
  defaultValue = { start: null, end: null },
  onChange,
  minDate,
  maxDate: maxDateProp,
  startPlaceholder = 'Start date',
  endPlaceholder = 'End date',
  disabled,
  size = 'medium',
  className,
}) => {
  const styles = useStyles();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [range, setRange] = useControllable<DateRange>(valueProp, defaultValue, onChange);

  const [mode, setMode] = React.useState<Mode>(() => getModeFromValue(range));
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);

  const dateStartRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMode(getModeFromValue(range));
  }, [range]);

  const endMinDate = React.useMemo(
    () => (range.start ? maxDate(minDate, startOfDay(range.start)) : minDate),
    [minDate, range.start]
  );
  const formatDate = React.useCallback((d?: Date) => {
    if (!d) return '';
    return d.toISOString().split('T')[0];
  }, []);

  const handleMenuSelect = (selectedMode: Mode) => {
    const presets = getDatePresets();
    setIsMenuOpen(false);

    switch (selectedMode) {
      case 'today':
        setRange(presets.today);
        break;
      case 'yesterday':
        setRange(presets.yesterday);
        break;
      case 'thisWeek':
        setRange(presets.thisWeek);
        break;
      case 'lastWeek':
        setRange(presets.lastWeek);
        break;
      case 'thisMonth':
        setRange(presets.thisMonth);
        break;
      case 'lastMonth':
        setRange(presets.lastMonth);
        break;

      case 'selectDate':
      case 'dateRange':
        setMode(selectedMode);

        requestAnimationFrame(() => {
          if (dateStartRef.current) {
            const dateStartInput = dateStartRef.current.querySelector(
              "[placeholder='Start date']"
            ) as HTMLElement;
            dateStartInput.click();
          }
        });

        break;
    }
  };

  // Handler for range selection (opens end date picker)
  const handleSelectStartForRange = (d: Date | null | undefined) => {
    const start = d ? startOfDay(d) : null;
    const isEndInvalid = range.end && start && range.end < start;
    setRange({ start, end: isEndInvalid ? null : range.end });
    setOpenStart(false);
    if (start) {
      setTimeout(() => setOpenEnd(true), 0);
    }
  };

  // Handler for single date selection (does NOT open end date picker)
  const handleSelectSingleDate = (d: Date | null | undefined) => {
    const date = d ? startOfDay(d) : null;
    setRange({ start: date, end: date });
    setOpenStart(false);
  };

  const handleSelectEnd = (d: Date | null | undefined) => {
    if (!range.start) {
      setOpenEnd(false);
      setOpenStart(true);
      return;
    }
    const picked = d ? startOfDay(d) : null;
    if (picked && startOfDay(picked) < startOfDay(range.start)) return;
    setRange({ start: range.start, end: picked });
    setOpenEnd(false);
  };

  const onStartOpenChange = (open: boolean) => {
    setOpenStart(open);
    if (open) {
      setOpenEnd(false);
      patchDatePickerPopupTheme(rootRef.current);
    }
  };
  const onEndOpenChange = (open: boolean) => {
    if (open && !range.start) {
      setOpenEnd(false);
      setOpenStart(true);
      return;
    }
    setOpenEnd(open);
    if (open) {
      setOpenStart(false);
      patchDatePickerPopupTheme(rootRef.current);
    }
  };

  const clearAll = () => {
    setRange({ start: null, end: null });
    setOpenStart(false);
    setOpenEnd(false);
  };

  const isDateRangeMode = mode !== 'selectDate' && mode !== 'today' && mode !== 'yesterday';

  return (
    <div ref={rootRef} className={mergeClasses(styles.root, className)}>
      <div className={styles.group} aria-label="Date range filter" role="group">
        <Menu open={isMenuOpen} onOpenChange={(_, data) => setIsMenuOpen(data.open)}>
          <MenuTrigger>
            <Button
              appearance="transparent"
              size="small"
              iconPosition="after"
              icon={<ChevronDown20Regular />}
              disabled={disabled}
            >
              {MODE_LABELS[mode]}
            </Button>
          </MenuTrigger>
          <MenuPopover>
            <MenuList>
              <MenuItem onClick={() => handleMenuSelect('dateRange')}>Date Range</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('selectDate')}>Select Date</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('today')}>Today</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('yesterday')}>Yesterday</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('thisWeek')}>This Week</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('lastWeek')}>Last Week</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('thisMonth')}>This Month</MenuItem>
              <MenuItem onClick={() => handleMenuSelect('lastMonth')}>Last Month</MenuItem>
            </MenuList>
          </MenuPopover>
        </Menu>

        <div />

        <div ref={dateStartRef}>
          <DatePicker
            className={styles.pickerStart}
            disabled={disabled}
            size={size}
            placeholder={startPlaceholder}
            value={range.start ?? undefined}
            // *** CRITICAL LOGIC CHANGE HERE ***
            onSelectDate={isDateRangeMode ? handleSelectStartForRange : handleSelectSingleDate}
            formatDate={formatDate}
            allowTextInput={false}
            minDate={minDate}
            maxDate={maxDateProp}
            open={openStart}
            onOpenChange={onStartOpenChange}
          />
          {isDateRangeMode && (
            <>
              <ArrowRight16Regular className={styles.arrowRight} aria-hidden />
              <DatePicker
                className={styles.pickerEnd}
                disabled={disabled}
                size={size}
                placeholder={endPlaceholder}
                value={range.end ?? undefined}
                onSelectDate={handleSelectEnd}
                formatDate={formatDate}
                allowTextInput={false}
                minDate={endMinDate}
                maxDate={maxDateProp}
                open={openEnd}
                onOpenChange={onEndOpenChange}
              />
            </>
          )}
        </div>

        {range.start && (
          <Button
            className={styles.clearBtn}
            appearance="transparent"
            size={size === 'small' ? 'small' : 'medium'}
            icon={<DismissCircle20Regular />}
            aria-label="Clear date range"
            title="Clear"
            onClick={clearAll}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

// packages/ui/src/components/DateRangePicker/index.tsx

import * as React from 'react';
import { makeStyles, tokens, shorthands, Button, mergeClasses } from '@fluentui/react-components';
// <-- [1] Import new icons and remove unused ones
import {
  ArrowRight16Regular,
  DismissCircle20Regular,
  CalendarMonth20Regular,
} from '@fluentui/react-icons';
import { DatePicker } from '@fluentui/react-datepicker-compat';

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
  startLabel?: string; // not used by compat DatePicker
  endLabel?: string; // not used by compat DatePicker
  startPlaceholder?: string;
  endPlaceholder?: string;
  disabled?: boolean;
  size?: 'medium' | 'small';
  className?: string;
};

// <-- [2] Edit all styles
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
    // paddingLeft: '22px',
    // paddingRight: '12px',
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
  value,
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
  const [range, setRange] = useControllable<DateRange>(value, defaultValue, onChange);

  const [openStart, setOpenStart] = React.useState(false);
  const [openEnd, setOpenEnd] = React.useState(false);

  React.useEffect(() => {
    if (range.start && range.end && startOfDay(range.end) < startOfDay(range.start)) {
      setRange({ start: range.start, end: null });
    }
  }, [range.start]); // eslint-disable-line react-hooks/exhaustive-deps

  const endMinDate = React.useMemo(
    () => (range.start ? maxDate(minDate, startOfDay(range.start)) : minDate),
    [minDate, range.start]
  );

  const formatDate = React.useCallback((d?: Date) => {
    if (!d) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const handleSelectStart = (d: Date | null | undefined) => {
    const start = d ? startOfDay(d) : null;
    setRange({ start, end: null });
    setOpenStart(false);
    if (start) setTimeout(() => setOpenEnd(true), 0);
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

  React.useEffect(() => {
    if (openStart || openEnd) patchDatePickerPopupTheme(rootRef.current);
  }, [openStart, openEnd]);

  return (
    <div ref={rootRef} className={mergeClasses(styles.root, className)}>
      {/* <-- [3] Edit the entire JSX structure --> */}
      <div className={styles.group} aria-label="Date range" role="group">
        <div className={styles.field}>
          <DatePicker
            className={styles.pickerStart}
            disabled={disabled}
            size={size}
            placeholder={startPlaceholder}
            value={range.start ?? undefined}
            onSelectDate={handleSelectStart}
            formatDate={formatDate}
            allowTextInput={false}
            minDate={minDate}
            maxDate={maxDateProp}
            open={openStart}
            onOpenChange={onStartOpenChange}
          />
        </div>

        <ArrowRight16Regular className={styles.arrowRight} aria-hidden />

        <div className={styles.field}>
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
            disabled={disabled || (!range.start && !range.end)}
          />
        )}
      </div>
    </div>
  );
};

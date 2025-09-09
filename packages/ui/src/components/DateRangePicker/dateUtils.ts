// packages/ui/src/components/DateRangePicker/dateUtils.ts

import type { DateRange } from './index'; // Import type จากไฟล์ index ที่จะสร้าง

// Helper to get the Monday of a given date's week
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

// Helper to get the Sunday of a given date's week
function getEndOfWeek(date: Date): Date {
  const startOfWeek = getStartOfWeek(date);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
}

// Helper to check if two dates are the same day, ignoring time
export function isSameDay(date1: Date | null, date2: Date | null): boolean {
  if (!date1 || !date2) return false;
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Main function to get all date presets
export const getDatePresets = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  const startOfThisWeek = getStartOfWeek(new Date());
  const endOfThisWeek = getEndOfWeek(new Date());

  const lastWeekDate = new Date();
  lastWeekDate.setDate(lastWeekDate.getDate() - 7);
  const startOfLastWeek = getStartOfWeek(lastWeekDate);
  const endOfLastWeek = getEndOfWeek(lastWeekDate);

  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  endOfThisMonth.setHours(23, 59, 59, 999);

  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  endOfLastMonth.setHours(23, 59, 59, 999);

  return {
    today: { start: today, end: todayEnd },
    yesterday: { start: yesterday, end: yesterdayEnd },
    thisWeek: { start: startOfThisWeek, end: endOfThisWeek },
    lastWeek: { start: startOfLastWeek, end: endOfLastWeek },
    thisMonth: { start: startOfThisMonth, end: endOfThisMonth },
    lastMonth: { start: startOfLastMonth, end: endOfLastMonth },
  };
};

export type Mode =
  | 'dateRange'
  | 'selectDate'
  | 'today'
  | 'yesterday'
  | 'thisWeek'
  | 'lastWeek'
  | 'thisMonth'
  | 'lastMonth';

// Function to determine the mode from a given DateRange value
export const getModeFromValue = (value: DateRange): Mode => {
  if (!value.start && !value.end) {
    return 'thisWeek'; // Default mode if nothing is selected
  }

  const presets = getDatePresets();

  if (isSameDay(value.start, presets.today.start)) return 'today';
  if (isSameDay(value.start, presets.yesterday.start)) return 'yesterday';
  if (isSameDay(value.start, presets.thisWeek.start) && isSameDay(value.end, presets.thisWeek.end)) return 'thisWeek';
  if (isSameDay(value.start, presets.lastWeek.start) && isSameDay(value.end, presets.lastWeek.end)) return 'lastWeek';
  if (isSameDay(value.start, presets.thisMonth.start) && isSameDay(value.end, presets.thisMonth.end)) return 'thisMonth';
  if (isSameDay(value.start, presets.lastMonth.start) && isSameDay(value.end, presets.lastMonth.end)) return 'lastMonth';

  if (isSameDay(value.start, value.end)) {
    return 'selectDate';
  }

  return 'dateRange';
};
// Date utility functions for date formatting, calculations, and timezone handling

import { DATE_FORMATS, TIME_ZONES } from '../config/constants';

/**
 * Date Formatting Utilities
 */
export const formatDate = (date: Date | string | number, format: string = DATE_FORMATS.MEDIUM): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const formatMap: Record<string, string> = {
    'yyyy': d.getFullYear().toString(),
    'MM': String(d.getMonth() + 1).padStart(2, '0'),
    'MMM': d.toLocaleDateString('en-US', { month: 'short' }),
    'MMMM': d.toLocaleDateString('en-US', { month: 'long' }),
    'dd': String(d.getDate()).padStart(2, '0'),
    'd': d.getDate().toString(),
    'HH': String(d.getHours()).padStart(2, '0'),
    'h': String(d.getHours() % 12 || 12),
    'mm': String(d.getMinutes()).padStart(2, '0'),
    'ss': String(d.getSeconds()).padStart(2, '0'),
    'a': d.getHours() >= 12 ? 'PM' : 'AM',
  };

  return format.replace(/yyyy|MMMM|MMM|MM|dd|d|HH|h|mm|ss|a/g, match => formatMap[match] || match);
};

export const formatTimeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};

export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
};

/**
 * Date Calculation Utilities
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date: Date, hours: number): Date => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const addMinutes = (date: Date, minutes: number): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};

export const getDaysDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

export const getHoursDifference = (date1: Date | string, date2: Date | string): number => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDiff = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(timeDiff / (1000 * 3600));
};

/**
 * Date Range Utilities
 */
export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const current = new Date(startDate);
  
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

export const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
  return date >= startDate && date <= endDate;
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day;
  
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  
  return { start, end };
};

export const getMonthRange = (date: Date): { start: Date; end: Date } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  return { start, end };
};

/**
 * Date Validation Utilities
 */
export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const isBusinessDay = (date: Date): boolean => {
  return !isWeekend(date);
};

/**
 * Timezone Utilities
 */
export const convertToTimezone = (date: Date, timezone: string): Date => {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const targetDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    const offset = utcDate.getTime() - targetDate.getTime();
    return new Date(date.getTime() + offset);
  } catch {
    return date;
  }
};

export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDateInTimezone = (date: Date, timezone: string, format: string = DATE_FORMATS.MEDIUM): string => {
  const convertedDate = convertToTimezone(date, timezone);
  return formatDate(convertedDate, format);
};

/**
 * Business Date Utilities
 */
export const getNextBusinessDay = (date: Date): Date => {
  const nextDay = addDays(date, 1);
  if (isBusinessDay(nextDay)) return nextDay;
  return getNextBusinessDay(nextDay);
};

export const getPreviousBusinessDay = (date: Date): Date => {
  const prevDay = subtractDays(date, 1);
  if (isBusinessDay(prevDay)) return prevDay;
  return getPreviousBusinessDay(prevDay);
};

export const getBusinessDaysBetween = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isBusinessDay(current)) count++;
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * Calendar Utilities
 */
export const getCalendarMonth = (date: Date): Date[][] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  
  // Start from the first day of the week
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  for (let i = 0; i < 42; i++) {
    currentWeek.push(new Date(startDate));
    startDate.setDate(startDate.getDate() + 1);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  
  return weeks;
};

export const getQuarter = (date: Date): number => {
  return Math.floor(date.getMonth() / 3) + 1;
};

export const getQuarterRange = (date: Date): { start: Date; end: Date } => {
  const year = date.getFullYear();
  const quarter = getQuarter(date);
  const startMonth = (quarter - 1) * 3;
  
  const start = new Date(year, startMonth, 1);
  const end = new Date(year, startMonth + 3, 0);
  
  return { start, end };
};

/**
 * Predefined Date Ranges
 */
export const getPresetDateRanges = () => ({
  today: {
    start: new Date(),
    end: new Date(),
    label: 'Today',
  },
  yesterday: {
    start: subtractDays(new Date(), 1),
    end: subtractDays(new Date(), 1),
    label: 'Yesterday',
  },
  last7days: {
    start: subtractDays(new Date(), 7),
    end: new Date(),
    label: 'Last 7 days',
  },
  last30days: {
    start: subtractDays(new Date(), 30),
    end: new Date(),
    label: 'Last 30 days',
  },
  thisMonth: {
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
    label: 'This month',
  },
  lastMonth: {
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    label: 'Last month',
  },
  thisYear: {
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(),
    label: 'This year',
  },
});

/**
 * ISO Date Utilities
 */
export const toISODateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const fromISODateString = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00.000Z');
};

export const toISODateTime = (date: Date): string => {
  return date.toISOString();
};

export const fromISODateTime = (dateTimeString: string): Date => {
  return new Date(dateTimeString);
};
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, subMonths } from 'date-fns';
import { CURRENCY_SYMBOLS } from './constants';
import type { Currency } from '@/types';

// ─── Currency Formatting ──────────────────────────────────────────────────────

/**
 * Format a number as a currency string
 * @example formatCurrency(1500, 'INR') → "₹1,500.00"
 */
export function formatCurrency(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol}${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a number compactly for dashboard display
 * @example formatCurrencyCompact(150000, 'INR') → "₹1.5L"
 */
export function formatCurrencyCompact(amount: number, currency: Currency = 'INR'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  if (amount >= 10_00_000) return `${symbol}${(amount / 10_00_000).toFixed(1)}M`;
  if (amount >= 1_00_000) return `${symbol}${(amount / 1_00_000).toFixed(1)}L`;
  if (amount >= 1_000) return `${symbol}${(amount / 1_000).toFixed(1)}K`;
  return `${symbol}${amount.toFixed(0)}`;
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

/** Returns today's date in YYYY-MM-DD format */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Returns a human-friendly date string */
export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy');
}

/** Returns short date like "Oct 27" */
export function formatDateShort(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d');
}

/** Returns current month date range */
export function currentMonthRange(): { start: string; end: string } {
  const now = new Date();
  return {
    start: format(startOfMonth(now), 'yyyy-MM-dd'),
    end: format(endOfMonth(now), 'yyyy-MM-dd'),
  };
}

/** Returns previous month date range */
export function previousMonthRange(): { start: string; end: string } {
  const last = subMonths(new Date(), 1);
  return {
    start: format(startOfMonth(last), 'yyyy-MM-dd'),
    end: format(endOfMonth(last), 'yyyy-MM-dd'),
  };
}

/** Returns current week date range */
export function currentWeekRange(): { start: string; end: string } {
  const now = new Date();
  return {
    start: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    end: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  };
}

// ─── Percentage Helpers ───────────────────────────────────────────────────────

/**
 * Calculate percentage change between two values
 * @returns positive = increase, negative = decrease
 */
export function percentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

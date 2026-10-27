/**
 * Default expense categories seeded for every new user.
 * Users can also create custom categories beyond these.
 */
export const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining',   icon: '🍔', color: '#FF6B6B' },
  { name: 'Groceries',       icon: '🛒', color: '#4ECDC4' },
  { name: 'Transport',       icon: '🚗', color: '#45B7D1' },
  { name: 'Shopping',        icon: '🛍️', color: '#96CEB4' },
  { name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7' },
  { name: 'Rent',            icon: '🏠', color: '#DDA0DD' },
  { name: 'Health',          icon: '💊', color: '#98D8C8' },
  { name: 'Entertainment',   icon: '🎬', color: '#F7DC6F' },
  { name: 'Education',       icon: '📚', color: '#82E0AA' },
  { name: 'Travel',          icon: '✈️', color: '#AED6F1' },
  { name: 'Personal Care',   icon: '💅', color: '#F1948A' },
  { name: 'Other',           icon: '📦', color: '#BDC3C7' },
] as const;

/**
 * Currency symbols for display
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'د.إ',
};

/**
 * Application-wide constants
 */
export const APP_CONFIG = {
  APP_NAME: 'Trackr',
  MAX_RECEIPT_SIZE_MB: 5,
  VOICE_MAX_DURATION_SECONDS: 30,
  INSIGHT_CACHE_TTL_DAYS: 1,
  DEFAULT_CURRENCY: 'INR',
} as const;

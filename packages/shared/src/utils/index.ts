/**
 * Shared utilities for the Doctor Appointment App
 */

import type { PaginationParams, PaginatedResponse, ApiResponse } from '../types';

interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

/**
 * Format a date to ISO string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Format a date for display (YYYY-MM-DD)
 */
export function formatDateDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
}

/**
 * Format time for display (HH:MM)
 */
export function formatTimeDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toTimeString().slice(0, 5);
}

/**
 * Format date and time for display
 */
export function formatDateTimeDisplay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${formatDateDisplay(d)} ${formatTimeDisplay(d)}`;
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d < new Date();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d > new Date();
}

/**
 * Add minutes to a date
 */
export function addMinutes(date: Date | string, minutes: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  return new Date(d.getTime() + minutes * 60000);
}

/**
 * Calculate difference in minutes between two dates
 */
export function diffMinutes(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  return Math.round((e.getTime() - s.getTime()) / 60000);
}

/**
 * Generate a slug from a string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Build paginated response
 */
export function buildPaginatedResponse<T>(
  data: T[],
  params: PaginationParams,
  total: number
): PaginatedResponse<T> {
  const page = (params as { page?: number }).page ?? 1;
  const limit = (params as { limit?: number }).limit ?? 20;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page: page as number,
      limit: limit as number,
      total,
      totalPages,
    },
  };
}

/**
 * Build success API response
 */
export function buildSuccessResponse<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
  const responseMeta: ApiMeta | null = meta ?? null;
  return {
    success: true,
    data,
    error: null,
    meta: responseMeta,
  } as ApiResponse<T>;
}

/**
 * Build error API response
 */
export function buildErrorResponse(
  code: string,
  message: string,
  details?: Record<string, unknown>
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: {
      code,
      message,
      details: details ?? null,
    },
    meta: null,
  };
}

/**
 * Parse comma-separated string to array
 */
export function parseCSV(str: string | undefined | null): string[] {
  if (!str) return [];
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Generate random string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Omit keys from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Pick keys from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry async function with exponential backoff
 */
export async function retry<T>(fn: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  let lastError: Error = new Error('Unknown error');

  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (i === maxRetries) break;
      await sleep(baseDelay * Math.pow(2, i));
    }
  }

  throw lastError;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (basic)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format full name
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/**
 * Check if user has role
 */
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Get role hierarchy level (higher = more permissions)
 */
export function getRoleLevel(role: string): number {
  const hierarchy = ['PATIENT', 'DOCTOR', 'STAFF', 'ADMIN'];
  return hierarchy.indexOf(role);
}

/**
 * Check if user can access resource based on role
 */
export function canAccess(userRole: string, requiredRole: string): boolean {
  return getRoleLevel(userRole) >= getRoleLevel(requiredRole);
}

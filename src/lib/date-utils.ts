// lib/date-utils.ts
import { headers } from 'next/headers';

export interface UserLocationInfo {
  dateKey: string;
  userLocalDate: Date;
  timezone: string;
  country: string;
  displayDate: string;
}

/**
 * Get user's local date and location info based on Vercel headers
 * Reusable across all server components that need timezone-aware dates
 */
export async function getUserLocalDate(): Promise<UserLocationInfo> {
  try {
    const headersList = await headers();
    const timezone = headersList.get('x-vercel-ip-timezone') || 'UTC';
    const country = headersList.get('x-vercel-ip-country') || 'Unknown';

    const now = new Date();
    const dateParts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    const year = dateParts.find(part => part.type === 'year')?.value ?? '1970';
    const month = dateParts.find(part => part.type === 'month')?.value ?? '01';
    const day = dateParts.find(part => part.type === 'day')?.value ?? '01';
    const dateKey = `${year}-${month}-${day}`;
    const userLocalDate = new Date(`${dateKey}T00:00:00Z`);

    const displayDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    }).format(now);
    
    console.log(`User timezone: ${timezone}, Country: ${country}, Local date: ${dateKey}`);
    
    return {
      dateKey,
      userLocalDate,
      timezone: timezone.replace('_', ' '),
      country,
      displayDate
    };
  } catch (error) {
    console.error('Error determining user timezone, falling back to UTC:', error);
    
    // Fallback: UTC date without time component
    const utcDate = new Date();
    const dateKey = utcDate.toISOString().split('T')[0];
    const userLocalDate = new Date(`${dateKey}T00:00:00Z`);
    
    const displayDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(utcDate);

    return {
      dateKey,
      userLocalDate,
      timezone: 'UTC',
      country: 'Unknown',
      displayDate
    };
  }
}

/**
 * Utility to check if two dates are the same (ignoring time)
 */
export function isSameDate(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Get date for a specific offset (yesterday, tomorrow, etc.)
 */
export function getOffsetDate(baseDate: Date, daysOffset: number): Date {
  const newDate = new Date(baseDate);
  newDate.setDate(newDate.getDate() + daysOffset);
  return newDate;
}

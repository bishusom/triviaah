// lib/date-utils.ts
import { headers } from 'next/headers';

export interface UserLocationInfo {
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
    let timezone = headersList.get('x-vercel-ip-timezone') || 'UTC';
    const country = headersList.get('x-vercel-ip-country') || 'Unknown';

    // If in development and no timezone header, use environment variable or UTC
    if (process.env.NODE_ENV === 'development' && !timezone) {
      timezone = process.env.DEV_TIMEZONE || 'UTC';
      console.log(`Development mode: using timezone from DEV_TIMEZONE: ${timezone}`);
    }
    
    // Create date in user's timezone
    const now = new Date();
    const userLocalDateString = now.toLocaleDateString('en-CA', { 
      timeZone: timezone 
    });
    
    // Parse back to Date object (en-CA format: YYYY-MM-DD)
    const [year, month, day] = userLocalDateString.split('-').map(Number);
    const userLocalDate = new Date(year, month - 1, day);
    
    // Format for display
    const displayDate = userLocalDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    });

    console.log(`User timezone: ${timezone}, Country: ${country}, Local date: ${userLocalDateString}`);
    
    return {
      userLocalDate,
      timezone: timezone.replace('_', ' '),
      country,
      displayDate
    };
  } catch (error) {
    console.error('Error determining user timezone, falling back to UTC:', error);
    
    // Fallback: UTC date without time component
    const utcDate = new Date();
    const userLocalDate = new Date(Date.UTC(
      utcDate.getUTCFullYear(), 
      utcDate.getUTCMonth(), 
      utcDate.getUTCDate()
    ));
    
    const displayDate = userLocalDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
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
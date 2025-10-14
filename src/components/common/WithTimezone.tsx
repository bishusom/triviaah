// components/common/WithTimezone.tsx
import { getUserLocalDate, UserLocationInfo } from '@/lib/date-utils';
import { ReactNode } from 'react';

interface WithTimezoneProps {
  children: (locationInfo: UserLocationInfo) => ReactNode;
  fallback?: ReactNode;
}

/**
 * Higher-Order Component that provides timezone data to its children
 * Usage: 
 * <WithTimezone>
 *   {(locationInfo) => <YourComponent locationInfo={locationInfo} />}
 * </WithTimezone>
 */
export async function WithTimezone({ children, fallback }: WithTimezoneProps) {
  try {
    const locationInfo = await getUserLocalDate();
    return <>{children(locationInfo)}</>;
  } catch (error) {
    console.error('Error in WithTimezone:', error);
    return fallback || <div>Error loading timezone information</div>;
  }
}
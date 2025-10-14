// components/common/TimezoneInfo.tsx
import { UserLocationInfo } from '@/lib/date-utils';

interface TimezoneInfoProps {
  locationInfo: UserLocationInfo;
  className?: string;
  showCountry?: boolean;
  showIcon?: boolean;
}

export function TimezoneInfo({ 
  locationInfo, 
  className = "text-xs text-gray-400",
  showCountry = true,
  showIcon = true 
}: TimezoneInfoProps) {
  return (
    <div className={`flex justify-center items-center gap-2 ${className}`}>
      {showIcon && <span>📅</span>}
      <span>{locationInfo.displayDate}</span>
      <span>•</span>
      {showIcon && <span>🌐</span>}
      <span>{locationInfo.timezone}</span>
      {showCountry && locationInfo.country !== 'Unknown' && (
        <>
          <span>•</span>
          <span>🇺🇸 {locationInfo.country}</span>
        </>
      )}
    </div>
  );
}
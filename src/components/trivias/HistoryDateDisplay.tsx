'use client';
import { format } from 'date-fns';

export default function HistoryDateDisplay({ 
  date,
  year 
}: {
  date: string;
  year: string;
}) {
  return (
    <div className="bg-blue-50 px-3 py-1 rounded-full text-sm inline-flex items-center">
      <span className="font-medium mr-2">
        {format(new Date(`${new Date().getFullYear()}-${date}`), 'MMM do')}
      </span>
      <span className="text-xs bg-blue-100 px-2 py-0.5 rounded-full">
        {year}
      </span>
    </div>
  );
}
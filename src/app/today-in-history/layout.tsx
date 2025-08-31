// src/app/trordle/layout.tsx
import { generateTodayInHistoryMetadata } from './metadata';

export const metadata = generateTodayInHistoryMetadata();

export default function TodayInHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
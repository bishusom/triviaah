// src/app/automobile/layout.tsx
import { generateAutomobileMetadata } from './metadata';

export const metadata = generateAutomobileMetadata();

export default function AutomobileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
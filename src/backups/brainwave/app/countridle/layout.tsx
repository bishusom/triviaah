// app/countridle/layout.tsx
import { generateCountridleMetadata } from './metadata';

export const metadata = generateCountridleMetadata();

export default function CountridleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
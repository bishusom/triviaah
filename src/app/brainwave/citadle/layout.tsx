// app/citadle/layout.tsx
import { generateCitadleMetadata } from './metadata';

export const metadata = generateCitadleMetadata();

export default function CitadleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
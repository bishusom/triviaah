// src/app/plotle/layout.tsx
import { generatePlotleMetadata } from './metadata';

export const metadata = generatePlotleMetadata();

export default function PlotleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
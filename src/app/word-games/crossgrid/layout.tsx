import { generateCrossgridMetadata } from './metadata';

export const metadata = generateCrossgridMetadata();

export default function CrossgridLayout({ children }: { children: React.ReactNode }) {
  return children;
}

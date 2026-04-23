// src/app/foodle/layout.tsx
import { generateFoodleMetadata } from './metadata';

export const metadata = generateFoodleMetadata();

export default function FoodleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
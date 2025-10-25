// app/trivias/loading.tsx
import { CategorySkeleton } from '@/components/common/CategorySkeleton';

export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 20 }).map((_, index) => (
          <CategorySkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
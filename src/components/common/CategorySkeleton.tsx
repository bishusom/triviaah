// components/common/CategorySkeleton.tsx
export function CategorySkeleton() {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md bg-white animate-pulse">
      <div className="relative h-40 w-full bg-gray-300" />
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
      </div>
    </div>
  );
}
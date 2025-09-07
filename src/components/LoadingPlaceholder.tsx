// components/LoadingPlaceholder.tsx
export default function LoadingPlaceholder({ type = "card" }) {
  if (type === "card") {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-full p-4 flex flex-col animate-pulse">
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 rounded-full bg-gray-200"></div>
        </div>
        <div className="text-center mb-3 flex-grow">
          <div className="h-4 bg-gray-200 rounded mb-2 mx-8"></div>
          <div className="h-3 bg-gray-200 rounded mx-12"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    );
  }
  
  if (type === "banner") {
    return <div className="h-20 bg-gray-100 animate-pulse"></div>;
  }
  
  return <div className="h-10 bg-gray-200 animate-pulse rounded"></div>;
}
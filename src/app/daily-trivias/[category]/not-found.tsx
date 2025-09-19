import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Quiz Not Available
      </h1>
      <p className="text-gray-600 mb-6">
        Today&apos;s quiz isn&apos;t ready yet. Please check back later or try another category.
      </p>
      <Link
        href="/daily"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Browse Other Categories
      </Link>
    </div>
  );
}
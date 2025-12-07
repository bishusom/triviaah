import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/markdown';

export const dynamic = 'force-dynamic';

interface SearchParams {
  page?: string;
}

interface PostData {
  slug: string;
  title: string;
  header: string;
  date: string;
  isoDate: string;
  excerpt: string;
  image: string;
}

interface BlogListPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { page: pageParam } = await searchParams;
  const page: number = parseInt(pageParam || '1') || 1;
  const postsPerPage: number = 5;
  
  const allPosts: PostData[] = await getAllPosts();
  
  // Sort posts by isoDate in descending order (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
  });
  
  const totalPages: number = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex: number = (page - 1) * postsPerPage;
  const paginatedPosts: PostData[] = sortedPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Blog Posts
        </h1>
        <p className="text-gray-600">
          Discover the latest articles and insights
        </p>
      </div>
      
      {/* Hero/Banner Image */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          <Image
            src="/imgs/default-blog.webp"
            alt="Blog Banner"
            fill
            className="object-cover opacity-80"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-center justify-center">
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold px-4 text-center">
              Exploring Knowledge One Post at a Time
            </h2>
          </div>
        </div>
      </div>
      
      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {paginatedPosts.map(post => (
          <div 
            key={post.slug}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white h-full"
          >
            {/* Post Image */}
            <div className="relative w-full h-40 overflow-hidden bg-gray-100">
              <Image
                src={post.image}
                alt={post.header}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            {/* Post Content */}
            <div className="flex flex-col flex-grow p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {post.header}
              </h2>
              
              <time className="text-sm text-gray-500 mb-3 block">
                {post.date}
              </time>
              
              <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                {post.excerpt}
              </p>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="font-medium text-blue-600 hover:text-blue-800 hover:underline self-start mt-auto"
              >
                Read More →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        {page > 1 && (
          <Link 
            href={`/blog?page=${page - 1}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Previous
          </Link>
        )}
        
        <span className="text-gray-700">
          Page <span className="font-semibold">{page}</span> of {totalPages}
        </span>
        
        {page < totalPages && (
          <Link 
            href={`/blog?page=${page + 1}`}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Next →
          </Link>
        )}
      </div>
    </div>
  );
}
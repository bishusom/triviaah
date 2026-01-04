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

// Generate metadata for the blog list page
export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { page: pageParam } = await searchParams;
  const page: number = parseInt(pageParam || '1') || 1;
  
  const allPosts: PostData[] = await getAllPosts();
  const totalPosts = allPosts.length;
  
  const pageSuffix = page > 1 ? ` - Page ${page}` : '';
  
  return {
    title: `TRIVIAAH Blog${pageSuffix} | Gaming Insights & Tips`,
    description: 'Level up your knowledge with the latest gaming insights, tips, and trivia. Explore our collection of gaming articles and tutorials.',
    keywords: 'gaming, blog, trivia, game tips, gaming news, video games, gaming insights',
    authors: [{ name: 'TRIVIAAH' }],
    alternates: {
      canonical: 'https://triviaah.com/blog'
    },
    openGraph: {
      title: `TRIVIAAH Blog${pageSuffix} | Gaming Insights & Tips`,
      description: 'Level up your knowledge with the latest gaming insights, tips, and trivia.',
      type: 'website',
      url: `https://triviaah.com/blog${page > 1 ? `?page=${page}` : ''}`,
      siteName: 'TRIVIAAH',
      images: [
        {
          url: '/imgs/blog-card.webp', // or your blog's default OG image
          width: 1200,
          height: 630,
          alt: 'TRIVIAAH Blog - Gaming Insights',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `TRIVIAAH Blog${pageSuffix} | Gaming Insights & Tips`,
      description: 'Level up your knowledge with the latest gaming insights, tips, and trivia.',
      images: ['/imgs/blog-card.webp'], // or your blog's default Twitter image
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { page: pageParam } = await searchParams;
  const page: number = parseInt(pageParam || '1') || 1;
  const postsPerPage: number = 6; // Better for grid layouts
  
  const allPosts: PostData[] = await getAllPosts();
  
  const sortedPosts = allPosts.sort((a, b) => {
    return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime();
  });
  
  const totalPages: number = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex: number = (page - 1) * postsPerPage;
  const paginatedPosts: PostData[] = sortedPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Gaming Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 py-20 rounded-2xl border-2 border-purple-400/30 mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          {/* Animated gradient overlay for extra gaming feel */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-slow"></div>
          
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg">
              TRIVIAAH BLOG
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Level up your knowledge with the latest gaming insights, tips, and trivia
            </p>
          </div>
        </div>

        {/* Separator with gaming style */}
        <div className="relative mb-16">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-6 py-2 text-sm text-purple-400 font-semibold border border-purple-500/30 rounded-full">
              LATEST POSTS
            </span>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post, index) => (
            <div 
              key={post.slug}
              className="group bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 hover:transform hover:-translate-y-2"
            >
              {/* Post Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image || '/imgs/blog-card.webp'}
                  alt={post.header}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    #{index + 1 + startIndex}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <time className="text-gray-400 text-sm">
                    {post.date}
                  </time>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                  {post.header}
                </h2>
                
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold group/link"
                >
                  Read More
                  <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination - Gaming Style */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="bg-gray-800 hover:bg-purple-600 text-white px-6 py-3 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 font-semibold"
              >
                ← Previous
              </Link>
            )}
            
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border-2 font-semibold transition-all duration-300 ${
                    pageNum === page
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </Link>
              ))}
            </div>

            {page < totalPages && (
              <Link
                href={`/blog?page=${page + 1}`}
                className="bg-gray-800 hover:bg-purple-600 text-white px-6 py-3 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 font-semibold"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
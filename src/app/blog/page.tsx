import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from '@/lib/markdown';
import Ads from '@/components/common/Ads';

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
  const pageSuffix = page > 1 ? ` - Page ${page}` : '';
  
  return {
    title: `Gaming Insights & Trivia Blog${pageSuffix} | Triviaah`,
    description: 'Level up your knowledge with our gaming blog. Explore expert tips, trivia facts, and deep dives into history, science, and pop culture through the lens of gaming.',
    keywords: 'gaming blog, trivia insights, game tips, educational gaming, triviaah news',
    alternates: {
      canonical: 'https://triviaah.com/blog'
    },
    openGraph: {
      title: `Gaming Insights & Trivia Blog${pageSuffix} | Triviaah`,
      description: 'Explore the latest gaming insights and trivia challenges on the Triviaah blog.',
      images: [{ url: '/imgs/blog-card.webp' }],
      type: 'website',
      siteName: 'Triviaah'
    },
    twitter: {
      card: 'summary_large_image',
      title: `Gaming Insights & Trivia Blog${pageSuffix} | Triviaah`,
      description: 'Explore the latest gaming insights and trivia challenges on the Triviaah blog.',
      images: ['/imgs/blog-card.webp'],
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

function StructuredData({ posts }: { posts: PostData[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Triviaah Blog",
          "description": "Gaming insights, tips, and trivia challenges.",
          "url": "https://triviaah.com/blog",
          "blogPost": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.header,
            "url": `https://triviaah.com/blog/${post.slug}`,
            "datePublished": post.isoDate,
            "image": `https://triviaah.com${post.image || '/imgs/blog-card.webp'}`,
            "author": { "@type": "Organization", "name": "Triviaah" }
          }))
        })
      }}
    />
  );
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { page: pageParam } = await searchParams;
  const page: number = parseInt(pageParam || '1') || 1;
  const postsPerPage: number = 8; // Better for 4-column grid
  
  const allPosts: PostData[] = await getAllPosts();
  const sortedPosts = allPosts.sort((a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime());
  
  const totalPages: number = Math.ceil(sortedPosts.length / postsPerPage);
  const startIndex: number = (page - 1) * postsPerPage;
  const paginatedPosts: PostData[] = sortedPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <StructuredData posts={paginatedPosts} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Compact Hero Section ────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Description */}
            <div className="lg:col-span-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl text-white">✍️</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                    Triviaah <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Blog</span>
                  </h1>
                </div>
              </div>
              <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                Expert insights, gaming tips, and fascinating trivia deep-dives. 
                Stay updated with the latest challenges and knowledge boosters.
              </p>
            </div>

            {/* Stats Column */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-slate-800/30 rounded-2xl p-6 border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-black text-3xl leading-none">{allPosts.length}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Articles</div>
                  </div>
                  <div className="w-px h-10 bg-white/10 mx-6"></div>
                  <div>
                    <div className="text-white font-black text-3xl leading-none">{page}</div>
                    <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-2">Current Page</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} className="lg:hidden" />
        </div>

        {/* Blog Grid - Compact 4-column layout */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {paginatedPosts.map((post, index) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              title={`Read full article: ${post.header}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-900/50 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-glow-blue"
            >
              {/* Post Image - Smaller aspect ratio */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image || '/imgs/blog-card.webp'}
                  alt={`${post.header} - Triviaah Blog Article`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-2 left-2">
                  <span className="bg-cyan-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                    #{index + 1 + startIndex}
                  </span>
                </div>
              </div>

              {/* Post Content - Tighter padding */}
              <div className="flex flex-grow flex-col p-3 sm:p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 sm:gap-2">
                    <time className="text-[9px] font-bold uppercase tracking-wider text-gray-500 sm:text-[10px]">
                      {post.date}
                    </time>
                    <div className="h-1 w-1 rounded-full bg-cyan-500"></div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 sm:text-[10px]">
                      5 min read
                    </span>
                  </div>
                </div>
                
                <h2 className="mb-2 line-clamp-3 text-sm font-black leading-snug text-white transition-colors group-hover:text-cyan-400 sm:line-clamp-2 sm:text-base">
                  {post.header}
                </h2>
                
                <p className="mb-4 line-clamp-2 text-[11px] leading-relaxed text-gray-400 sm:line-clamp-3 sm:text-xs">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-1.5 text-[9px] font-black uppercase tracking-wider text-cyan-400 transition-all duration-300 group-hover:bg-cyan-500 group-hover:text-white sm:gap-2 sm:px-3 sm:text-[10px] sm:tracking-widest">
                    Read Article
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination - Gaming Style */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            {page > 1 && (
              <Link
                href={`/blog?page=${page - 1}`}
                className="bg-gray-800 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg border-2 border-gray-700 hover:border-cyan-500 transition-all duration-300 font-semibold"
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
                      ? 'bg-cyan-600 border-cyan-500 text-white'
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
                className="bg-gray-800 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg border-2 border-gray-700 hover:border-cyan-500 transition-all duration-300 font-semibold"
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

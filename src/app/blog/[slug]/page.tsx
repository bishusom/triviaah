import Image from 'next/image';
import Link from 'next/link';
import { getPostData } from '@/lib/markdown';
import { Twitter, Linkedin, Facebook, Link2, Share2 } from 'lucide-react';

interface Params {
  slug: string;
}

interface PostContent {
  slug: string;
  title: string;
  header: string;
  date: string;
  isoDate: string;
  excerpt: string;
  image: string;
  contentHtml: string;
}

interface PostPageProps {
  params: Promise<Params>;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post: PostContent = await getPostData(slug);
  return {
    title: `${post.title} | Triviaah`,
    description: post.excerpt,
    openGraph: {
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostData(slug);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
            TRIVIAAH BLOG
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {post.header}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <time dateTime={post.isoDate} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {post.date}
            </time>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Gaming
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.image && post.image !== '/default-image.jpg' && (
          <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-12 border-2 border-gray-700">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent"></div>
          </div>
        )}

        {/* Article Content */}
        <div 
          className="prose prose-lg prose-invert max-w-none
                     prose-headings:text-white prose-headings:font-bold
                     prose-p:text-gray-300 prose-p:leading-relaxed
                     prose-a:text-purple-400 prose-a:no-underline hover:prose-a:text-purple-300
                     prose-strong:text-white prose-strong:font-bold
                     prose-blockquote:border-purple-500 prose-blockquote:text-gray-400
                     prose-ul:text-gray-300 prose-ol:text-gray-300
                     prose-code:text-purple-300 prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded
                     prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
        />

        {/* Article Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-purple-600 text-white px-6 py-3 rounded-lg border-2 border-gray-700 hover:border-purple-500 transition-all duration-300 font-semibold group"
            >
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
              Back to All Posts
            </Link>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Share2 size={16} />
                Share this post:
              </span>
              <div className="flex items-center gap-2">
                {/* Twitter Share */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.header)}&url=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-blue-500 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-blue-400 transition-all duration-300 group"
                  title="Share on Twitter"
                >
                  <Twitter size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Twitter</span>
                </a>

                {/* LinkedIn Share */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-blue-600 transition-all duration-300 group"
                  title="Share on LinkedIn"
                >
                  <Linkedin size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">LinkedIn</span>
                </a>

                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://yourdomain.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-800 hover:bg-blue-600 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 group"
                  title="Share on Facebook"
                >
                  <Facebook size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Facebook</span>
                </a>

                {/* Copy Link */}
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`https://yourdomain.com/blog/${post.slug}`);
                      // You could add a toast notification here
                      alert('Link copied to clipboard!');
                    } catch (err) {
                      console.error('Failed to copy link: ', err);
                    }
                  }}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-purple-600 text-white px-4 py-2 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 group"
                  title="Copy link to clipboard"
                >
                  <Link2 size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
import Image from 'next/image';
import Link from 'next/link';
import { getPostData } from '@/lib/markdown';
import { Twitter, Linkedin, Facebook, Share2 } from 'lucide-react';
import CopyLinkButton from '@/components/blog/CopyLinkButton';
import Ads from '@/components/common/Ads';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);

  // Split HTML content at paragraph tags to inject an ad
  const contentParts = post.contentHtml.split('</p>');
  const middleIndex = Math.floor(contentParts.length / 2);
  
  const topContent = contentParts.slice(0, middleIndex).join('</p>') + '</p>';
  const bottomContent = contentParts.slice(middleIndex).join('</p>');

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href="/blog" className="text-purple-400 hover:text-purple-300">← Back to Blog</Link>
        </div>
      </nav>

      <article className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">{post.header}</h1>
          <time className="text-gray-400">{post.date}</time>
        </header>

        {/* Grayish readability container */}
        <div className="bg-gray-50 rounded-2xl shadow-xl overflow-hidden text-black">
          {post.image && (
            <div className="relative h-64 md:h-96 w-full border-b border-gray-200">
              <Image src={post.image} alt={post.title} fill className="object-cover" priority />
            </div>
          )}

          <div className="px-6 py-10 md:px-16 md:py-16">
            {/* Top Half - prose-p:mb-6 fixes the line break issue */}
            <div 
              className="prose prose-lg max-w-none prose-p:mb-6 prose-p:text-gray-800 prose-headings:text-black prose-strong:text-black"
              dangerouslySetInnerHTML={{ __html: topContent }} 
            />

            {/* In-Article Ad */}
            <Ads isInArticle={true} format="fluid" />

            {/* Bottom Half */}
            <div 
              className="prose prose-lg max-w-none prose-p:mb-6 prose-p:text-gray-800 prose-headings:text-black prose-strong:text-black"
              dangerouslySetInnerHTML={{ __html: bottomContent }} 
            />
          </div>
        </div>

        {/* Final Footer Ad */}
        <div className="mt-8">
          <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
        </div>

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
                <CopyLinkButton slug={post.slug} />
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
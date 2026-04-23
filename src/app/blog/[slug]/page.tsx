import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { getPostData } from '@/lib/markdown';
import { Twitter, Linkedin, Facebook, Share2 } from 'lucide-react';
import CopyLinkButton from '@/components/blog/CopyLinkButton';
import Ads from '@/components/common/Ads';

// src/app/blog/[slug]/page.tsx

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) return { title: 'Post Not Found' };

  const postUrl = `https://triviaah.com/blog/${slug}`;
  const imageUrl = post.image || '/imgs/blog-card.webp';
  const description =
    post.excerpt || `Read our latest deep dive into ${post.title}. Professional trivia insights and educational content.`;

  return {
    title: `${post.title} | Triviaah Blog`,
    description,
    alternates: {
      canonical: postUrl,
    },
    authors: [{ name: 'Triviaah' }],
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      siteName: 'Triviaah',
      type: 'article',
      publishedTime: post.isoDate || post.date,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.header || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostData(slug);
  const postUrl = `https://triviaah.com/blog/${post.slug}`;
  const imageUrl = post.image || 'https://triviaah.com/imgs/blog-card.webp';
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.header || post.title,
    name: post.title,
    description:
      post.excerpt || `Read our latest deep dive into ${post.title}. Professional trivia insights and educational content.`,
    url: postUrl,
    mainEntityOfPage: postUrl,
    image: [imageUrl],
    datePublished: post.isoDate || post.date,
    dateModified: post.isoDate || post.date,
    author: {
      '@type': 'Organization',
      name: 'Triviaah',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Triviaah',
      logo: {
        '@type': 'ImageObject',
        url: 'https://triviaah.com/imgs/logo.webp',
      },
    },
  };

  // Split HTML content at paragraph tags to inject an ad
  const contentParts = post.contentHtml.split('</p>');
  const middleIndex = Math.floor(contentParts.length / 2);
  
  const topContent = contentParts.slice(0, middleIndex).join('</p>') + '</p>';
  const bottomContent = contentParts.slice(middleIndex).join('</p>');

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight">
            {post.header}
          </h1>
          <time className="text-gray-400 text-xs font-black uppercase tracking-widest shrink-0 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
            {post.date}
          </time>
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
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Share2 size={16} />
                Share this post:
              </span>
              <div className="flex items-center gap-2">
                {/* Twitter Share */}
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.header)}&url=${encodeURIComponent(postUrl)}`}
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
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
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
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
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

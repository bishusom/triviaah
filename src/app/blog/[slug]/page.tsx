import { getPostData } from '@/lib/markdown';
import Image from 'next/image';

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

export async function generateMetadata({ params }: PostPageProps): Promise<{
  title: string;
  description: string;
  openGraph: { images: string[] };
}> {
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
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.header}
        </h1>
        <time 
          className="text-gray-600 text-sm md:text-base block"
          dateTime={post.isoDate}
        >
          {post.date}
        </time>
      </header>
      
      {/* Featured Image */}
      {post.image && post.image !== '/default-image.jpg' && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gray-100">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="prose prose-lg max-w-none">
        <div 
          className="text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
        />
      </div>
    </article>
  );
}
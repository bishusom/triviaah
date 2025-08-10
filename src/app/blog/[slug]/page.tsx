import { getPostData } from '@/lib/markdown';
import styles from '@/../styles/Blog.module.css';

// Define the type for params
interface Params {
  slug: string;
}

// Define the type for post data (matching markdown.ts)
interface PostContent {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  excerpt: string;
  image: string;
  contentHtml: string;
}

// Define props for the component
interface PostPageProps {
  params: Promise<Params>;
}

// Metadata generation
export async function generateMetadata({ params }: PostPageProps): Promise<{
  title: string;
  description: string;
  openGraph: { images: string[] };
}> {
  const { slug } = await params; // Await the params Promise
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
  const { slug } = await params; // Await the params Promise
  const post: PostContent = await getPostData(slug);

  return (
    <div className={styles.postContainer}>
      <header className={styles.postHeader}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <time className={styles.postDate} dateTime={post.isoDate}>{post.date}</time>
      </header>
      <div 
        className={styles.postContent}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
      />
    </div>
  );
}
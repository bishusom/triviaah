import { getPostData } from '@/lib/markdown';
import styles from '@/../styles/Blog.module.css';

export async function generateMetadata({ params }) {
  const post = await getPostData(params.slug);
  return {
    title: `${post.title} | Triviaah`,
    description: post.excerpt,
    openGraph: {
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }) {
  const post = await getPostData(params.slug);

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
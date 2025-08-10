import { getAllPosts } from '@/lib/markdown';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';

export const dynamic = 'force-dynamic';

// Define the type for searchParams
interface SearchParams {
  page?: string;
}

// Define the type for post data (matching markdown.ts)
interface PostData {
  slug: string;
  title: string;
  date: string;
  isoDate: string;
  excerpt: string;
  image: string;
}

// Define props for the component
interface BlogListPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const { page: pageParam } = await searchParams; // Await the searchParams Promise
  const page: number = parseInt(pageParam || '1') || 1;
  const postsPerPage: number = 5;
  
  const allPosts: PostData[] = await getAllPosts();
  const totalPages: number = Math.ceil(allPosts.length / postsPerPage);
  
  const startIndex: number = (page - 1) * postsPerPage;
  const paginatedPosts: PostData[] = allPosts.slice(startIndex, startIndex + postsPerPage);

  return (
    <div className={styles.container}>
      <h1>Blog Posts</h1>
      
      <div className={styles.blogGrid}>
        {paginatedPosts.map(post => (
          <div key={post.slug} className={styles.blogCard}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <time className={styles.postDate}>{post.date}</time>
            <p className={styles.postExcerpt}>{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className={styles.readMore}>
              Read More
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {page > 1 && (
          <Link href={`/blog?page=${page - 1}`} className={styles.paginationLink}>
            Previous
          </Link>
        )}
        
        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        
        {page < totalPages && (
          <Link href={`/blog?page=${page + 1}`} className={styles.paginationLink}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
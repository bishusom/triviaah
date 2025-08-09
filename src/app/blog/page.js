import { getAllPosts } from '@/lib/markdown';
import Link from 'next/link';
import styles from '@/../styles/Blog.module.css';

export const dynamic = 'force-dynamic';

export default async function BlogListPage({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  const postsPerPage = 5;
  
  const allPosts = await getAllPosts();
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  
  const startIndex = (page - 1) * postsPerPage;
  const paginatedPosts = allPosts.slice(startIndex, startIndex + postsPerPage);

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
import Link from 'next/link';
import { FC } from 'react';
import styles from '@/../styles/Blog.module.css';

// Define the type for the post prop
interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

interface BlogCardProps {
  post: Post;
}

const BlogCard: FC<BlogCardProps> = ({ post }) => {
  return (
    <div className={styles.blogCard}>
      <img src={post.image} alt={post.title} />
      <div className={styles.cardContent}>
        <h2>{post.title}</h2>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <p className={styles.date}>{post.date}</p>
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          Read More →
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
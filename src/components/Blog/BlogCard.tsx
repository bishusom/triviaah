import Link from 'next/link';
import { FC } from 'react';
import styles from '@/../styles/Blog.module.css';
import Image from 'next/image'; // Import the Image component

// Define the type for the post prop
interface Post {
  slug: string;
  title: string;
  header: string;
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
      <Image 
        src={post.image} 
        alt={post.header}
        width={500} // Set appropriate width
        height={300} // Set appropriate height
        className={styles.image} // Add this to your CSS module if needed
      />
      <div className={styles.cardContent}>
        <h2>{post.header}</h2>
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
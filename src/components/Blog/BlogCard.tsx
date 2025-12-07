import Link from 'next/link';
import { FC } from 'react';
import Image from 'next/image';

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
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white">
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <Image 
          src={post.image} 
          alt={post.header}
          fill
          className="object-cover transition-transform duration-500 hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      {/* Card Content */}
      <div className="flex flex-col flex-grow p-6">
        {/* Title/Header */}
        <h2 className="mb-3 text-xl font-bold text-gray-800 line-clamp-2">
          {post.header}
        </h2>
        
        {/* Excerpt */}
        <p className="mb-4 flex-grow text-gray-600 line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Date and Read More */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {post.date}
          </p>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
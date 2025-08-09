'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BreadcrumbNav() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  return (
    <div className="bg-blue-600 text-white py-3 px-4 shadow-md">
      <div className="container mx-auto flex items-center text-sm md:text-base">
        <Link 
          href="/" 
          className="hover:text-blue-100 transition-colors duration-200"
        >
          Home
        </Link>
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const segmentName = segment.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');

          return (
            <span key={href} className="flex items-center">
              <span className="mx-2 text-blue-200">/</span>
              {isLast ? (
                <span className="font-semibold text-blue-100">
                  {segmentName}
                </span>
              ) : (
                <Link 
                  href={href} 
                  className="hover:text-blue-100 transition-colors duration-200"
                >
                  {segmentName}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
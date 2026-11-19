'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BreadcrumbNav() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  return (
    <nav aria-label="Breadcrumb navigation" className="border-b border-[#dedfd4] bg-[#faf8f2] px-4 py-2 text-[#526a5e]">
      <div className="container mx-auto flex flex-wrap items-center text-sm">
        <Link 
          href="/" 
          className="rounded-sm transition-colors duration-200 hover:text-[#17675b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c66c35]"
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
              <span className="mx-2 text-[#9aa79d]" aria-hidden="true">/</span>
              {isLast ? (
                <span className="font-semibold text-[#203b3a]" aria-current="page">
                  {segmentName}
                </span>
              ) : (
                <Link 
                  href={href} 
                  className="rounded-sm transition-colors duration-200 hover:text-[#17675b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c66c35]"
                >
                  {segmentName}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
}

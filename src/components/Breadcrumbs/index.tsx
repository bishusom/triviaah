'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className="bg-gray-800 border-b border-gray-700 text-white px-4 py-3 shadow-md"
    >
      <ol className="container mx-auto flex items-center gap-2 text-sm">
        <li>
          <Link 
            href="/" 
            className="hover:text-grey-200 transition-colors"
            aria-label="Home"
          >
            Home
          </Link>
        </li>
        {paths.map((path, i) => {
          const href = `/${paths.slice(0, i + 1).join('/')}`;
          const isLast = i === paths.length - 1;
          const name = path.replace(/-/g, ' ');

          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight className="text-grey-300 text-xs" />
              {isLast ? (
                <span 
                  className="font-medium capitalize text-white" 
                  aria-current="page"
                >
                  {name}
                </span>
              ) : (
                <Link 
                  href={href}
                  className="hover:text-grey-200 transition-colors capitalize"
                >
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function SeoBreadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": paths.map((path, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": path.replace(/-/g, ' '),
      "item": `https://triviaah.com/${paths.slice(0, i + 1).join('/')}`
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(breadcrumbs)}
    </script>
  );
}
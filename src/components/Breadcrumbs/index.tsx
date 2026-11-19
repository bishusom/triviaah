'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0) return null;
  const light = /^\/(?:daily-trivias|challenges)(?:\/[^/]+)?(?:\/quiz)?$/.test(pathname)
    || /^\/brainwave(?:\/[^/]+)?$/.test(pathname)
    || /^\/trivias(?:\/[^/]+){0,2}(?:\/quiz)?$/.test(pathname)
    || /^\/trivia-bank(?:\/[^/]+)?$/.test(pathname)
    || /^\/(?:about|contact)$/.test(pathname)
    || /^\/blog(?:\/[^/]+)?$/.test(pathname)
    || /^\/multiplayer(?:\/[^/]+)?$/.test(pathname)
    || /^\/(?:word-games|number-puzzles|retro-games)(?:\/[^/]+)?$/.test(pathname)
    || /^\/leaderboard(?:\/groups)?$/.test(pathname);

  return (
    <nav 
      aria-label="Breadcrumb navigation" 
      className={light ? "bg-[#faf8f2] border-b border-[#dedfd4] text-[#526a5e] px-4 py-2" : "bg-black/20 backdrop-blur-sm border-b border-white/5 text-white/60 px-4 py-2"}
    >
      <ol className="container mx-auto flex flex-wrap items-center gap-2 text-sm">
        <li>
          <Link 
            href="/" 
            className={light ? "transition-colors hover:text-[#17675b]" : "transition-colors hover:text-gray-200"}
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
              <ChevronRight size={14} className={light ? "text-[#9aa79d]" : "text-gray-400"} aria-hidden="true" />
              {isLast ? (
                <span 
                  className={`font-medium capitalize ${light ? "text-[#203b3a]" : "text-white"}`}
                  aria-current="page"
                >
                  {name}
                </span>
              ) : (
                <Link 
                  href={href}
                  className={light ? "capitalize transition-colors hover:text-[#17675b]" : "capitalize transition-colors hover:text-gray-200"}
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

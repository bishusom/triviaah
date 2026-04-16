import Script from 'next/script';
import HomePageContent from '@/components/home/HomePageContent';

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Triviaah',
        url: 'https://triviaah.com',
        description: 'Free daily trivia, quizzes, word games, number puzzles, and brain training challenges.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://triviaah.com/trivias?search={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: 'Triviaah',
        url: 'https://triviaah.com',
        logo: 'https://triviaah.com/imgs/triviaah-og.webp',
      },
      {
        '@type': 'WebPage',
        name: 'Triviaah: Free Daily Trivia & Quiz Games',
        url: 'https://triviaah.com',
        description:
          'Discover fun, free daily trivia challenges across 20+ exciting categories like movies, history, and science at Triviaah. Test your knowledge with fresh questions every 24 hours.',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Triviaah',
          url: 'https://triviaah.com',
        },
      },
    ],
  };

  return (
    <>
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageContent />
    </>
  );
}

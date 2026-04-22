import type { TriviaCategoryFaqItem } from '@/lib/trivia-categories';

type LandingStructuredDataProps = {
  category: string;
  title: string;
  description: string;
  faqItems: TriviaCategoryFaqItem[];
};

export function LandingStructuredData({
  category,
  title,
  description,
  faqItems,
}: LandingStructuredDataProps) {
  const pageUrl = `https://triviaah.com/daily-trivias/${category}`;
  void faqItems;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `${title} Daily Quiz | Triviaah`,
        description,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

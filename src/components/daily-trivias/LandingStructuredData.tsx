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
      ...(faqItems.length > 0
        ? [{
            '@type': 'FAQPage',
            '@id': `${pageUrl}/#faq`,
            mainEntity: faqItems.slice(0, 6).map((item) => ({
              '@type': 'Question',
              name: item.title,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
          }]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}

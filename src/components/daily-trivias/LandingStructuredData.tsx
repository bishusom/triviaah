type LandingStructuredDataProps = {
  category: string;
  title: string;
  description: string;
  lastUpdated: string;
};

export function LandingStructuredData({
  category,
  title,
  description,
  lastUpdated,
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
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: lastUpdated,
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

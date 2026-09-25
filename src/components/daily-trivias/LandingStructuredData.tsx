import type { Question } from '@/lib/supabase';

type LandingStructuredDataProps = {
  category: string;
  title: string;
  description: string;
  lastUpdated: string;
  questions?: Question[];
};

export function LandingStructuredData({
  category,
  title,
  description,
  lastUpdated,
  questions = [],
}: LandingStructuredDataProps) {
  const pageUrl = `https://triviaah.com/daily-trivias/${category}`;
  
  const questionSchemas = questions.map((q, idx) => ({
    '@type': 'Question',
    name: q.question,
    position: idx + 1,
    suggestedAnswer: (q.options || []).map((opt, optIdx) => ({
      '@type': 'Answer',
      position: optIdx + 1,
      text: opt,
    })),
    acceptedAnswer: {
      '@type': 'Answer',
      text: q.correct,
    },
  }));

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}/#webpage`,
      url: pageUrl,
      name: `${title} Daily Quiz | Triviaah`,
      description,
      datePublished: '2024-01-01T00:00:00+00:00',
      dateModified: lastUpdated,
    },
  ];

  if (questionSchemas.length > 0) {
    graph.push({
      '@type': 'Quiz',
      '@id': `${pageUrl}/#quiz`,
      name: `${title} Daily Quiz Challenge`,
      description,
      url: pageUrl,
      numberOfQuestions: 6,
      timeRequired: 'PT3M',
      educationalLevel: 'Intermediate',
      about: {
        '@type': 'Thing',
        name: title,
      },
      hasPart: questionSchemas,
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}


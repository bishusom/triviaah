// src/app/daily-trivias/[category]/structured-data.tsx
//
// ✅ FIX: Consolidated from 3 separate schema blocks into one @graph.
//    Multiple disconnected <script type="application/ld+json"> blocks
//    are valid, but a single @graph is cleaner and avoids duplicate
//    @id collisions (e.g. two blocks both defining the Organization node).
//
// ✅ FIX: Removed the Article schema. These pages are quizzes, not articles.
//    Google evaluates Article schema as editorial content — no byline, no
//    article body → thin article. The Quiz schema is the right type here
//    and already covers everything Article was trying to add.
//
// ✅ FIX: timeRequired uses correct ISO 8601 duration format.
//    PT${n}S is correct (e.g. PT150S for 150 seconds total).

import type { Question } from '@/lib/supabase';

// Static per-category data used in schema descriptions
const CATEGORY_SUBJECTS: Record<string, string> = {
  'quick-fire':        'rapid-fire general knowledge',
  'general-knowledge': 'general knowledge',
  'today-in-history':  'historical events',
  'entertainment':     'movies, music, and pop culture',
  'geography':         'world geography, capitals, and landmarks',
  'science':           'science and nature',
  'arts-literature':   'arts and literature',
  'sports':            'sports history and athletes',
};

interface StructuredDataProps {
  category: string;
  formattedCategory: string;
  dateKey: string;
  lastUpdated: string;
  questions: Question[];
}

export function StructuredData({
  category,
  formattedCategory,
  dateKey,
  lastUpdated,
  questions,
}: StructuredDataProps) {
  if (!questions || questions.length === 0) return null;

  const isQuickfire = category === 'quick-fire';
  const timePerQuestion = isQuickfire ? 15 : 30;
  const pageUrl = `https://triviaah.com/daily-trivias/${category}`;
  const subject = CATEGORY_SUBJECTS[category] ?? formattedCategory.toLowerCase();

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      // ── Organization (referenced by publisher fields below) ──────────────
      {
        '@type': 'Organization',
        '@id': 'https://triviaah.com/#organization',
        name: 'Triviaah',
        url: 'https://triviaah.com',
        description: 'Free daily trivia quizzes and games across multiple knowledge categories.',
        logo: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/logo.png',
          width: 200,
          height: 60,
        },
        sameAs: [
          'https://twitter.com/elitetrivias',
          'https://www.facebook.com/elitetrivias',
          'https://www.instagram.com/elitetrivias',
        ],
      },

      // ── WebSite ──────────────────────────────────────────────────────────
      {
        '@type': 'WebSite',
        '@id': 'https://triviaah.com/#website',
        url: 'https://triviaah.com/',
        name: 'Triviaah',
        description: 'Engaging trivia games and puzzles for everyone',
        publisher: { '@id': 'https://triviaah.com/#organization' },
      },

      // ── WebPage ──────────────────────────────────────────────────────────
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        name: `${formattedCategory} Daily Quiz | Triviaah`,
        description: `Free daily ${subject} trivia quiz. ${questions.length} multiple-choice questions refreshed every 24 hours.`,
        isPartOf: { '@id': 'https://triviaah.com/#website' },
        about: { '@id': `${pageUrl}/#quiz` },
        datePublished: '2024-01-01T00:00:00+00:00',
        // ✅ dateModified reflects today's date — signals to Google this is
        // intentionally fresh content, not stale/inconsistent content.
        dateModified: lastUpdated,
        breadcrumb: { '@id': `${pageUrl}/#breadcrumb` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `https://triviaah.com/imgs/daily-trivias/${category}.webp`,
          width: 1200,
          height: 630,
        },
      },

      // ── Quiz ─────────────────────────────────────────────────────────────
      {
        '@type': 'Quiz',
        '@id': `${pageUrl}/#quiz`,
        name: `${formattedCategory} Daily Quiz — ${dateKey}`,
        description: `Daily ${subject} trivia quiz with ${questions.length} multiple-choice questions. ${timePerQuestion} seconds per question. Refreshes every 24 hours.`,
        url: pageUrl,
        dateCreated: dateKey,
        dateModified: lastUpdated,
        numberOfQuestions: questions.length,
        // ISO 8601 duration: total time = timePerQuestion × questions.length seconds
        timeRequired: `PT${timePerQuestion * questions.length}S`,
        educationalLevel: 'Beginner',
        assesses: formattedCategory,
        publisher: { '@id': 'https://triviaah.com/#organization' },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        hasPart: questions.map((q, i) => ({
          '@type': 'Question',
          position: i + 1,
          name: q.question,
          text: q.question,
          eduQuestionType: 'Multiple choice',
          suggestedAnswer: q.options.map((opt: string) => ({
            '@type': 'Answer',
            text: opt,
          })),
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.correct,
            ...(q.titbits ? { comment: q.titbits } : {}),
          },
        })),
      },

      // ── BreadcrumbList ───────────────────────────────────────────────────
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}/#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',         item: 'https://triviaah.com' },
          { '@type': 'ListItem', position: 2, name: 'Daily Trivia', item: 'https://triviaah.com/daily-trivias' },
          { '@type': 'ListItem', position: 3, name: formattedCategory, item: pageUrl },
        ],
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

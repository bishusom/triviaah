// src/app/today-in-history/metadata.ts
import { Metadata } from 'next';

export function generateTodayInHistoryMetadata(): Metadata {
  // For server-side metadata, we use a generic approach since we don't know user timezone yet
  // The actual date will be shown client-side
  
  return {
    title: `On This Day in History - Today's Historical Events Quiz`,
    description: `Discover what happened on this day in history. Take our daily personalized history quiz based on your local date and learn fascinating historical facts from around the world.`,
    keywords: [
      'today in history',
      'historical events',
      'history quiz',
      'on this day',
      'history facts',
      'daily quiz',
      'historical trivia',
      'world history'
    ],
    openGraph: {
      title: `On This Day in History - Today's Quiz`,
      description: `What happened on this day in history? Take our daily quiz personalized for your local date!`,
      url: 'https://elitetrivias.com/today-in-history',
      images: [
        {
          url: '/imgs/today-history-rect.webp',
          width: 1200,
          height: 630,
          alt: 'Today in History Trivia - Personalized for Your Timezone'
        }
      ],
      type: 'website',
      locale: 'en_US'
    },
    twitter: {
      card: 'summary_large_image',
      title: `On This Day in History - Today's Quiz`,
      description: `Discover historical events from your local date in our personalized daily quiz!`,
      images: ['/imgs/today-history-rect.webp']
    },
    alternates: {
      canonical: 'https://elitetrivias.com/today-in-history'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}
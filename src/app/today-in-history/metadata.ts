// src/app/trordle/metadata.ts
import { Metadata } from 'next';

export function generateTrordleMetadata(): Metadata {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric'
  });

  return {
    title: `On This Day in History - ${formattedDate} | Historical Events`,
    description: `Discover what happened on ${formattedDate} in history. Take our daily history quiz and learn fascinating historical facts.`,
    keywords: [
      'today in history',
      'historical events',
      'history quiz',
      'on this day',
      'history facts',
      formattedDate.split(' ')[0]
    ],
    openGraph: {
      title: `On This Day in History - ${formattedDate}`,
      description: `What happened on ${formattedDate} in history? Take our daily quiz to find out!`,
      url: 'https://triviaah.com/today-in-history',
      images: [
        {
          url: '/imgs/today-history-rect.webp',
          width: 1200,
          height: 630,
          alt: 'Today in History Trivia'
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `On This Day in History - ${formattedDate}`,
      description: `Discover historical events from ${formattedDate} in our daily quiz!`
    }
  };
}
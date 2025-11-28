import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MuteButton from '@/components/common/MuteButton';

const inter = Inter({ subsets: ['latin'] });

interface Props {
  children: React.ReactNode;
  params: Promise<{ category: string }>;
}

const categoryMetadata: Record<string, { name: string; tagline: string; keywords: string }> = 
{
    'quick-fire': {
    name: 'Quick Fire',
    tagline: 'Quick fire trivia - 6 questions 10 mins each. Test your reaction time and knowledge with our 60-second challenge! Play and see how many you can get right in just one minute.',
    keywords: 'rapid fire trivia, quick fire triva, general knowledge quiz, daily trivia, daily quiz with answers',
  },
  'general-knowledge':
  {
    name: 'General Knowledge',
    tagline: 'Test your worldly wisdom with diverse daily trivia challenges with any topics under the sun',
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions, daily quiz with answers',
  },
  'today-in-history':
  {
    name: 'Today in History',
    tagline: 'Discover today&pos;s historical events in free online trivia - from famous birthdays to significant events',
    keywords: 'historical trivia quiz, on this day trivia, history facts game, history quiz with answers',
  },
  'entertainment':
  {
    name: 'Entertainment',
    tagline: 'Pop culture trivia quizzes featuring movies, music, tv/web series & celebrities - we got you covered!',
    keywords: 'pop culture trivia quizzes, movie trivia game, celebrity quiz, entertainment quiz answers',
  },
  'geography':
  {
    name: 'Geography',
    tagline: 'Explore world geography through interactive trivia challenges - countries, capitals, landmarks & maps, we have it all!',
    keywords: 'geography trivia quiz, world capitals game, countries trivia, geography quiz with answers',
  },
  'science':
  {
    name: 'Science & Nature',
    tagline: 'Discover science & animal kingdom wonders in our free online daily trivia - from biology to space exploration, from mammals to marine life - we cover it all!',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions, science quiz with answers',
  },
  'arts-literature':
  {
    name: "Arts & Literature",
    tagline: "Explore the world of great authors, artists, and literary masterpieces through our engaging daily trivia quizzes",
    keywords: "literature trivia quiz, famous authors quiz, art history questions, classic books quiz, painting trivia, poetry quiz questions"
  },
  'sports':
  {
    name: 'Sports',
    tagline: 'Test your knowledge of sports history, athletes, and events with our exciting sports trivia quizzes and challenges designed for sports enthusiasts of all levels',
    keywords: 'sports trivia quiz, athlete trivia, sports history game, sports quiz with answers',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  const metadata = categoryMetadata[category] || {
    name: 'Trivia',
    tagline: 'Test your knowledge with our daily quizzes on various topics',
    keywords: 'trivia quiz, daily quiz, knowledge test'
  };

  return {
    title: `${metadata.name} Daily Quiz | Triviaah`,
    description: metadata.tagline,
    keywords: metadata.keywords,
    openGraph: {
      title: `${metadata.name} Daily Quiz | Triviaah`,
      description: metadata.tagline,
      type: 'website',
      url: `https://triviaah.com/daily/${category}`,
      images: [{
        url: `/imgs/daily-trivias/${category}.webp`,
        width: 1200,
        height: 630,
        alt: `${metadata.name} Daily Quiz`,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metadata.name} Daily Quiz | Triviaah`,
      description: metadata.tagline,
      images: [`/imgs/${category}-og.webp`],
    },
  };
}

export default async function DailyLayout({ children }: Props) {
  // Await the params if you need to use them in the layout
  // const resolvedParams = await params;
  // const category = resolvedParams.category;
  
  return (
    <div className={`${inter.className} bg-gradient-to-b from-gray-900 to-gray-800`}>
      <div className="no-ads-page">
        <main className="min-h-screen p-4 md:p-8">
          <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
            <MuteButton />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
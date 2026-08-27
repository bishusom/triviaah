import Ads from '@/components/common/Ads';
import HorizontalScrollSection from '@/components/home/sections/collapsible/HorizontalScrollSection';
import Footer from '@/components/home/Footer';
import { DAILY_QUIZZES, BRAIN_WAVES } from '@/config/homeContent';
import HeroSection from '@/components/home/sections/collapsible/HeroSection';
import SeoContentSection from '@/components/home/sections/collapsible/SeoContentSection';
import KeyFeatures from '@/components/home/sections/collapsible/KeyFeatures';
import DailyTriviaFact from '@/components/home/sections/DailyTriviaFact';
import SectionContainer from '@/components/home/sections/collapsible/SectionContainer';
import WeeklyChallengesSection from '@/components/home/sections/WeeklyChallengesSection';

const FEATURED_DAILY_QUIZZES = DAILY_QUIZZES.filter((item) =>
  ['general-knowledge', 'quick-fire', 'today-in-history', 'entertainment', 'sports', 'nature'].includes(item.category),
);

const FEATURED_BRAIN_WAVES = BRAIN_WAVES.filter((item) =>
  ['plotle', 'capitale', 'historidle', 'celebrile', 'songle', 'literale'].includes(item.category),
);

export default function HomePageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <div className="bg-gray-800/50 py-6">
        <div className="container mx-auto px-4">
          <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 flex-grow">
        <HeroSection />

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection
            title="Daily Quiz Challenges"
            items={FEATURED_DAILY_QUIZZES}
            isQuizSection
            link="/daily-trivias"
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection
            title="Brain Waves - Daily Puzzle Games"
            items={FEATURED_BRAIN_WAVES}
            link="/brainwave"
          />
        </SectionContainer>

        <div className="bg-gray-800/50 py-6 rounded-xl my-6">
          <div className="container mx-auto px-4">
            <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
          </div>
        </div>

        <SectionContainer className="horizontal-scroll-section">
          <DailyTriviaFact />
        </SectionContainer>

        {/* Weekly Challenges section placed below Daily Facts */}
        <SectionContainer className="horizontal-scroll-section">
          <WeeklyChallengesSection />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <SeoContentSection />
        </SectionContainer>

        <KeyFeatures />
      </main>

      <div className="bg-gray-800/50 py-6">
        <div className="container mx-auto px-4">
          <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

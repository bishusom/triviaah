// app/daily-trivias/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import Ads from '@/components/common/Ads';
import { Play, Boxes, Clock, Users, Calendar, Star, Trophy, Brain, Zap } from 'lucide-react';
import Timer from '@/components/daily/dailyQuizTimer';
import { ScrollToDailyCategoriesButton } from '@/components/daily-trivias/ScrollToDailyCategoriesButton';
import ExploreSections from '@/components/common/ExploreSections';
import { getTriviaCategories, type TriviaCategoryRecord } from '@/lib/trivia-categories';

export const metadata: Metadata = {
  title: 'Daily Trivia Game - Play Fresh Quizzes Every 24 Hours | Triviaah',
  description: 'Play our free daily trivia game with new questions about history, pop culture, sports, science and more! Test your knowledge daily with 10 fresh questions across 8 categories.',
  keywords: 'daily trivia game, daily quiz, multiplayer trivia, multiplayer quiz, private trivia room, trivia challenges, fun quiz, knowledge test, history trivia, sports trivia, science trivia',
  alternates: {
    canonical: 'https://triviaah.com/daily-trivias',
  },
  openGraph: {
    title: 'Daily Trivia Game - New Questions Every Day | Triviaah',
    description: 'Challenge yourself with our daily trivia game. 10 fresh questions every 24 hours across history, sports, science, geography and more!',
    url: 'https://triviaah.com/daily-trivias',
    siteName: 'Triviaah',
    images: [
      {
        url: '/imgs/daily-trivias/daily-trivia-og.webp',
        width: 1200,
        height: 630,
        alt: 'Daily Trivia Game - Play Now',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Trivia Game - New Questions Every Day | Triviaah',
    description: 'Challenge yourself with our daily trivia game. 10 fresh questions every 24 hours!',
    images: ['/imgs/daily-trivias/daily-trivia-og.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

type DailyQuizCard = {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
};

function categoryToDailyQuizCard(category: TriviaCategoryRecord): DailyQuizCard {
  const name = category.displayName || category.title;
  return {
    category: category.slug,
    name,
    path: `/daily-trivias/${category.slug}`,
    image: category.ogImage || `/imgs/daily-trivias/${category.slug}.webp`,
    tagline: category.description || category.longDescription || `Play ${name} daily trivia.`,
    keywords: category.keywords.join(', '),
  };
}

// Gaming-style quiz card
function QuizCard({ quiz, index }: { quiz: DailyQuizCard; index: number }) {
  return (
    <Link
      key={quiz.category}
      href={quiz.path}
      title={`Play ${quiz.name} Daily Quiz - ${quiz.tagline}`}
      className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-500 bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/20 hover:border-cyan-400/40"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-400/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

      {/* Quiz Image */}
      <div className="relative aspect-square w-full bg-gradient-to-br from-cyan-900 to-purple-900 overflow-hidden">
        <Image
          src={quiz.image}
          alt={`${quiz.name} Daily Trivia Quiz`}
          fill
          className="object-contain transition-all duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAAcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          loading={index < 8 ? 'eager' : 'lazy'}
          priority={index < 4}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play button overlay */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-5 h-5 text-white" />
        </div>

        {/* Daily badge */}
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          DAILY
        </div>
      </div>

      {/* Quiz Content */}
      <div className="p-6 relative z-10">
        <h3 className="min-h-[4.5rem] text-lg font-bold leading-tight text-white mb-2 line-clamp-3 group-hover:text-cyan-300 transition-colors sm:min-h-[5.5rem]">
          {quiz.name}
        </h3>
        <p className="text-sm text-gray-300 line-clamp-2">{quiz.tagline}</p>

        {/* Progress bar effect */}
        <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700" />
        </div>
      </div>
    </Link>
  );
}

// Category detail card for the SEO section
function CategoryDetail({
  quiz,
  accentClass,
  details,
}: {
  quiz: DailyQuizCard;
  accentClass: string;
  details: string;
}) {
  return (
    <div className="border border-gray-700 rounded-xl p-5 hover:border-cyan-500/30 transition-colors duration-300">
      <h3 className={`text-lg font-bold mb-2 ${accentClass}`}>{quiz.name} Daily Trivia</h3>
      <p className="text-gray-300 text-sm leading-relaxed mb-2">{quiz.tagline}</p>
      <p className="text-gray-400 text-sm leading-relaxed">{details}</p>
      <Link
        href={quiz.path}
        className={`mt-3 inline-flex items-center gap-1 text-sm font-semibold ${accentClass} hover:underline`}
      >
        Play {quiz.name} →
      </Link>
    </div>
  );
}

// Static extra detail blurbs per category slug
const categoryDetails: Record<string, string> = {
  'quick-fire':
    'Perfect for players who love a fast-paced challenge. Six questions, ten seconds each — no time to second-guess yourself. Topics rotate daily across sports, science, pop culture, and history, so every session feels completely different.',
  'general-knowledge':
    'The broadest of our daily trivia categories, covering geography, history, science, language, and everyday facts. Ideal if you want a well-rounded mental workout that touches every corner of human knowledge in a single ten-question session.',
  'today-in-history':
    'Each day the quiz is anchored to real events that occurred on that exact calendar date throughout history — births, discoveries, battles, treaties, and cultural milestones. It is the most dynamic category on the site because the content is literally tied to the day.',
  'entertainment':
    'From Oscar-winning films and Grammy-award albums to viral TV moments and celebrity headlines, this category covers the full spectrum of pop culture. Questions range from classic Hollywood to current streaming hits, making it great for all generations.',
  'geography':
    'Test your spatial knowledge with questions on country capitals, flags, mountain ranges, oceans, and cultural regions. Whether you are a seasoned traveller or an armchair explorer, this quiz sharpens your awareness of the world we live in.',
  'science':
    'Covering biology, chemistry, physics, astronomy, environmental science, and technology breakthroughs, this category is refreshed daily with questions that range from beginner-friendly to genuinely challenging for science enthusiasts.',
  'arts-literature':
    'From Renaissance painters and Shakespearean plays to contemporary novelists and graphic novels, this category celebrates creative expression across centuries and continents. A great daily habit for book lovers, art fans, and culture-curious minds alike.',
  'sports':
    'Featuring questions on football, basketball, tennis, athletics, cricket, the Olympics, and more, this category covers the full range of global sport. Expect questions about legendary athletes, record-breaking moments, championship history, and sporting rules.',
};

export default async function DailyQuizzesPage() {
  const dailyCategories = await getTriviaCategories('daily-trivias');
  const dailyQuizzes = dailyCategories.map(categoryToDailyQuizCard);
  const lastUpdated = new Date();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Structured Data for SEO */}
        <StructuredData quizzes={dailyQuizzes} currentDate={lastUpdated} />

        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <div className="mb-8 lg:mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Title & Description */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="text-2xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tight">
                    Daily{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Trivias
                    </span>
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-base leading-relaxed text-gray-300 md:text-lg">
                Fresh trivia challenges every 24 hours. Delve into daily trivia quizzes across topics like History,
                Sports, Science, Geography, Entertainment, Arts & Literature and mother of all - General Knowledge. Choose a
                category, answer 10 new questions, and come back tomorrow again for a refreshed set of brain-teasers. 
                No accounts, no fees — just pure daily trivia fun for everyone.
              </p>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ScrollToDailyCategoriesButton targetId="daily-trivia-categories" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-slate-800/30 px-3 py-1.5 rounded-full border border-white/5 inline-block">
                  Last Updated:{' '}
                  {lastUpdated.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="mt-5 max-w-2xl rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white">Multiplayer trivia is available</h2>
                    <p className="mt-1 text-sm text-emerald-100/80">
                      Pick a daily category, create a private room, and invite friends to compete on the same questions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timer & Stats Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                <Timer />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/50 rounded-xl p-2 border border-white/5 text-center">
                  <Boxes className="text-lg text-cyan-400 mx-auto mb-1" />
                  <div className="text-white font-black text-base">{dailyQuizzes.length}</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Topics</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-2 border border-white/5 text-center">
                  <Clock className="text-lg text-yellow-400 mx-auto mb-1" />
                  <div className="text-white font-black text-base">24h</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Reset</div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-2 border border-white/5 text-center">
                  <Users className="text-lg text-green-400 mx-auto mb-1" />
                  <div className="text-white font-black text-base">Invite</div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-500">Friends</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4">
          <Ads
            format="horizontal"
            slot="2207590813"
            isMobileFooter={false}
            className="lg:hidden"
          />
        </div>

        {/* ── Category Grid ─────────────────────────────────────────────── */}
        <div id="daily-trivia-categories" className="mb-16 scroll-mt-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            All Daily Trivia Categories
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {dailyQuizzes.map((quiz, index) => (
              <QuizCard key={quiz.category} quiz={quiz} index={index} />
            ))}
          </div>
        </div>

        {/* ── How It Works ──────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            How Daily Trivia Quizzes Work
          </h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-8">
            Triviaah's daily trivia system is built around one simple idea: a fresh mental challenge
            every single day, for free, with no account required. Here is exactly how it works.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">New Questions Every 24 Hours</h3>
              <p className="text-gray-300">
                All quiz categories reset at midnight local time. Each reset brings a completely new
                set of questions — nothing is repeated from the previous day. This means you can
                build a daily habit and always expect something new when you return.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Track Your Daily Streak</h3>
              <p className="text-gray-300">
                Categories you have already played show a completion checkmark so you always know
                where you stand. Once the clock resets, all categories open back up. Come back
                tomorrow and start your streak over — or beat yesterday's score.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Share and Compete</h3>
              <p className="text-gray-300">
                After completing a quiz you can share your score directly with friends via link or
                social media. Challenge colleagues or family members to beat your result before the
                day's questions disappear. It is the easiest way to add a little friendly rivalry to
                your day.
              </p>
            </div>
          </div>
        </div>

        {/* ── Why Daily Trivia ──────────────────────────────────────────── */}
        <section className="mb-16 bg-slate-800/40 rounded-2xl p-8 border border-white/5">
          <h2 className="text-3xl font-bold text-white mb-4">
            Why Play Daily Trivia Every Day?
          </h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            Research consistently shows that regular recall practice — answering questions from
            memory rather than simply re-reading — is one of the most effective ways to retain
            information long-term. A short daily trivia session gives your brain exactly that kind
            of workout in five minutes or less.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" /> Keeps Your Mind Sharp
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Switching between different knowledge domains — from a geography question to a
                science fact to a sports record — exercises the same mental flexibility that helps
                you think clearly and creatively throughout the day. Our rotating categories are
                designed specifically to make every session feel like a different workout for your
                brain.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-400 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> Great for Groups
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Because every player sees the same questions on any given day, daily trivia creates
                a shared experience. Families use it at the dinner table, office teams run it as a
                quick lunchtime competition, and friend groups share screenshots of their scores.
                The 24-hour window means everyone has an equal shot before the questions reset.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Learn Something New Every Day
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Wrong answers are learning opportunities. Each question comes with the correct
                answer at the end of the quiz, so even a tough day leaves you walking away with
                five or ten new facts. Over weeks and months, those daily snippets of knowledge
                genuinely add up to a broader understanding of history, science, culture, and the
                world around you.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Fits Any Schedule
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Each quiz takes roughly three to five minutes to complete. That is shorter than
                scrolling your news feed during a coffee break. No registration, no downloads, no
                subscriptions — just tap a category and start answering. The simplicity is
                intentional: the goal is to make it as easy as possible to show up every day.
              </p>
            </div>
          </div>
        </section>

        {/* ── Category Deep-Dives ───────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Explore Every Daily Trivia Category
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">
            Each of the {dailyQuizzes.length} categories below gets a completely fresh set of
            questions every 24 hours. Browse the descriptions to find the category that matches your
            interests — or challenge yourself by playing all of them before midnight.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dailyQuizzes.map((quiz, index) => {
              const accents = [
                'text-cyan-400',
                'text-purple-400',
                'text-green-400',
                'text-yellow-400',
                'text-pink-400',
                'text-orange-400',
                'text-blue-400',
                'text-red-400',
              ];
              const accent = accents[index % accents.length];
              const details =
                categoryDetails[quiz.category] ||
                `A hand-curated selection of ${quiz.name.toLowerCase()} questions refreshed every day. Whether you are a beginner or an expert, you will find questions that challenge and entertain.`;
              return (
                <CategoryDetail
                  key={quiz.category}
                  quiz={quiz}
                  accentClass={accent}
                  details={details}
                />
              );
            })}
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: 'How often are new daily trivia quizzes available?',
                answer:
                  'All daily trivia quizzes are updated every 24 hours at midnight in your local timezone. Each quiz category gets a completely fresh set of questions daily, so there is always something new waiting for you when you return.',
              },
              {
                question: 'Are the daily trivia quizzes completely free?',
                answer:
                  'Yes — every quiz on Triviaah is 100% free to play. There are no hidden fees, no subscription tiers, and no premium question packs. We believe knowledge challenges should be accessible to everyone.',
              },
              {
                question: 'What categories of daily trivia are available?',
                answer: `We currently offer ${dailyQuizzes.length} categories: ${dailyQuizzes.map((q) => q.name).join(', ')}. Each one covers a different knowledge domain and is refreshed independently every 24 hours.`,
              },
              {
                question: 'Do I need to create an account to play?',
                answer:
                  'No account or registration is required. Simply choose a category and start answering. Your completed quizzes are tracked locally in your browser so the checkmarks persist until the next daily reset.',
              },
              {
                question: 'How many questions are in each daily quiz?',
                answer:
                  'Most categories contain 10 carefully selected questions. The Quick Fire category is an exception — it features 6 questions but with a strict 10-second timer per question, making it our most intense daily challenge.',
              },
              {
                question: 'Can I play previous days\' quizzes?',
                answer:
                  'Currently Triviaah focuses on today\'s fresh content only. Each day\'s questions are replaced at midnight and previous sets are not archived. This keeps the experience focused on a shared daily challenge rather than an on-demand quiz bank.',
              },
              {
                question: 'What difficulty level are the questions?',
                answer:
                  'Each daily set mixes question difficulty deliberately — you will typically find a few straightforward questions to get you started, several moderate challenges, and one or two that will stump even frequent players. The mix keeps every quiz engaging regardless of your experience level.',
              },
              {
                question: 'Can I use daily trivia for a pub quiz or team game?',
                answer:
                  'Absolutely. Because everyone playing on the same day sees the same questions, Triviaah daily quizzes work perfectly as a shared team challenge. You can also use Play With Friends to create a private multiplayer room with an invite link and shared scoreboard.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/30 transition-all duration-300"
              >
                <h3 className="font-semibold text-lg text-white mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEO Content Section ───────────────────────────────────────── */}
        <section className="bg-gray-800 rounded-2xl p-8 mb-12 border border-gray-700">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-white mb-4">
              About Our Daily Trivia Game
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Triviaah's daily trivia game is built for people who want a meaningful mental
              challenge without a major time commitment. Every category resets every 24 hours,
              which means the site always has something worth returning to. Whether you play one
              category over breakfast or work through all {dailyQuizzes.length} before dinner, the
              format adapts to however much time you have available.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Daily trivia also works as a lightweight multiplayer trivia game. Open a daily
              category, choose Play With Friends, and Triviaah creates a private invite room where
              friends answer the same daily questions with a shared scoreboard. It is built for
              quick remote challenges, family quiz nights, classroom warmups, and small group
              competitions without requiring accounts.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              The question bank behind each category is carefully curated rather than
              algorithmically generated. Our team reviews every question for accuracy, clarity, and
              appropriate difficulty before it appears in a daily set. That means you will not
              encounter trick questions with ambiguous wording or obscure trivia that requires
              specialist knowledge to answer — just well-crafted questions that genuinely test what
              you know.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              We cover {dailyQuizzes.length} distinct knowledge areas:{' '}
              {dailyQuizzes.map((q) => q.name).join(', ')}. Each topic has its own dedicated
              question pool, so playing General Knowledge one day and Geography the next gives you
              a genuinely different experience rather than the same questions reshuffled. The
              breadth of topics also means you are likely to find at least one category that sits
              squarely in your area of interest — and several that push you outside your comfort
              zone.
            </p>

            <h3 className="text-xl font-bold text-white mb-3">Tips for Getting the Best Score</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Daily trivia rewards consistency more than raw knowledge. Players who return every
              day tend to improve steadily because the act of recalling information — even
              incorrectly — primes your memory for related facts in future sessions. A few
              practical tips:
            </p>
            <ul className="space-y-2 text-gray-300 mb-6 list-none pl-0">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>
                  <strong className="text-white">Read questions carefully.</strong> Many incorrect
                  answers come from skimming. Trivia questions often hinge on a single word —
                  "first," "largest," "before," or "after."
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>
                  <strong className="text-white">Trust your instincts on the first pass.</strong>{' '}
                  Research shows that your initial answer in a recall task is correct more often
                  than changed answers, especially under time pressure.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>
                  <strong className="text-white">Review the answers at the end.</strong> Every
                  question you get wrong is a learning opportunity. Spending 30 seconds reading the
                  correct answers after you finish will help those facts stick.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">→</span>
                <span>
                  <strong className="text-white">Try categories outside your comfort zone.</strong>{' '}
                  If you are a sports expert, push yourself on Arts & Literature. Cross-domain
                  knowledge builds stronger long-term memory connections.
                </span>
              </li>
            </ul>

            <h3 className="text-xl font-bold text-white mb-3">
              Daily Trivia vs. Regular Quiz Apps
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Most quiz apps offer unlimited on-demand questions, which sounds appealing but often
              leads to binge sessions followed by long gaps. The daily format enforces a natural
              rhythm: one focused session per day, then a 24-hour wait for new content. This
              structure is more sustainable as a long-term habit, similar to how daily word games
              and puzzle apps have built loyal audiences by offering one meaningful challenge per
              day rather than an endless scroll of questions. Triviaah takes the same approach and
              applies it across {dailyQuizzes.length} knowledge categories, so you get variety
              without losing the satisfying routine of a daily ritual.
            </p>
          </div>
        </section>

        <ExploreSections exclude="daily-trivias" />
      </div>
    </div>
  );
}

// Structured Data Component for SEO
function StructuredData({ quizzes, currentDate }: { quizzes: any[]; currentDate: Date }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://triviaah.com/#organization',
        name: 'Triviaah',
        url: 'https://triviaah.com/',
        description: 'Triviaah offers engaging and educational trivia games and puzzles for everyone.',
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
      {
        '@type': 'WebPage',
        '@id': 'https://triviaah.com/daily-trivias/#webpage',
        url: 'https://triviaah.com/daily-trivias',
        name: 'Daily Trivia Game - Play Fresh Quizzes Every 24 Hours | Triviaah',
        description:
          'Play our free daily trivia game with new questions about history, pop culture, sports, and more! Test your knowledge daily with 10 fresh questions.',
        isPartOf: { '@id': 'https://triviaah.com/#website' },
        about: { '@id': 'https://triviaah.com/daily-trivias/#itemlist' },
        datePublished: '2024-01-01T00:00:00+00:00',
        dateModified: currentDate.toISOString(),
        breadcrumb: { '@id': 'https://triviaah.com/daily-trivias/#breadcrumb' },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://triviaah.com/imgs/daily-trivias/daily-trivia-og.webp',
          width: 1200,
          height: 630,
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://triviaah.com/#website',
        url: 'https://triviaah.com/',
        name: 'Triviaah',
        description: 'Engaging trivia games and puzzles for everyone',
        publisher: { '@id': 'https://triviaah.com/#organization' },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://triviaah.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },
      {
        '@type': 'ItemList',
        '@id': 'https://triviaah.com/daily-trivias/#itemlist',
        name: 'Daily Trivia Games',
        description: 'Collection of daily trivia quizzes updated every 24 hours',
        numberOfItems: quizzes.length,
        itemListElement: quizzes.map((quiz, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Game',
            name: quiz.name,
            description: quiz.tagline,
            url: `https://triviaah.com${quiz.path}`,
            gameType: 'TriviaGame',
            genre: ['trivia', 'educational', 'daily-challenge'],
            applicationCategory: 'Game',
            numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 1 },
            publisher: { '@id': 'https://triviaah.com/#organization' },
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://triviaah.com/daily-trivias/#breadcrumb',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Daily Trivia',
            item: 'https://triviaah.com/daily-trivias',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How often are new daily trivia quizzes available?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'All daily trivia quizzes are updated every 24 hours at midnight in your local timezone. Each quiz category gets a completely fresh set of questions daily.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are the daily trivia quizzes completely free?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! All our daily trivia quizzes are 100% free to play with no registration required. No hidden fees or subscriptions.',
            },
          },
          {
            '@type': 'Question',
            name: 'What categories of daily trivia are available?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `We offer ${quizzes.length} different trivia categories including ${quizzes.map((q) => q.name).join(', ')}. Each category has unique questions updated daily.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need to create an account to play daily trivia?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No account or registration is required. You can start playing any daily trivia quiz immediately without signing up.',
            },
          },
          {
            '@type': 'Question',
            name: 'How many questions are in each daily quiz?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Most categories contain 10 carefully selected questions. Quick Fire features 6 questions with a 10-second timer per question.',
            },
          },
          {
            '@type': 'Question',
            name: 'What difficulty level are the questions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Each daily set deliberately mixes difficulty levels — a few straightforward questions to get started, several moderate challenges, and one or two that will stump even frequent players.',
            },
          },
        ],
      },
    ],
  };

  return (
    <Script
      id="structured-data-daily-trivias"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

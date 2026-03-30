'use client';
import NavBar from './NavBar';
import Billboard from './sections/Billboard';
import { NetflixRow } from './sections/NetflixRow';
import Footer from './Footer';
import Ads from '@/components/common/Ads';
import DailyTriviaFact from './sections/DailyTriviaFact';
import { DAILY_QUIZZES, BRAIN_WAVES, RETRO_GAMES, WORD_GAMES, NUMBER_PUZZLES, IQ_PERSONALITY_TESTS } from '@/config/homeContent';

export default function HomePageContent() {
  // Mapping your specific categories for the Netflix rows
  const wordGames = [
    { title: "Word Scramble", image: "/imgs/word-games/word-scramble.webp", path: "/word-games/scramble" },
    { title: "Spelling Bee", image: "/imgs/word-games/spelling-bee.webp", path: "/word-games/spelling-bee" },
    { title: "Boggle", image: "/imgs/word-games/boggle.webp", path: "/word-games/boggle" },
    { title: "Word Search", image: "/imgs/word-games/word-search.webp", path: "/word-games/word-search" },
    { title: "Word Ladder", image: "/imgs/word-games/word-ladder.webp", path: "/word-games/word-ladder" },
  ];

  const numberGames = [
    { title: "Number Scramble", image: "/imgs/number-puzzles/number-scramble.webp", path: "/number-puzzles/number-scramble" },
    { title: "Prime Hunter", image: "/imgs/number-puzzles/prime-hunter.webp", path: "/number-puzzles/prime-hunter" },
    { title: "Number Sequence", image: "/imgs/number-puzzles/number-sequence.webp", path: "/number-puzzles/number-sequence" },
    { title: "Number Tower", image: "/imgs/number-puzzles/number-tower.webp", path: "/number-puzzles/number-tower" },
    { title: "Sudoku Challenge", image: "/imgs/number-puzzles/sudoku.webp", path: "/number-puzzles/sudoku" }
  ];

  return (
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
      <NavBar />
      
      <main className="flex flex-col">
        {/* Top Ad Slot */}
        <div className="w-full pt-24 pb-4 bg-black/20 flex justify-center">
          <Ads format="fluid" style={{ width: '100%', maxWidth: '1200px', height: '90px' }} />
        </div>

        <Billboard />

        {/* FIX: Changed -mt-48 to -mt-24 to prevent overlap with Billboard text/buttons.
            Added pt-10 to give the first row some breathing room.
        */}
        <div className="relative z-20 -mt-24 md:-mt-32 pt-10 space-y-12 pb-24 bg-gradient-to-t from-[#141414] via-[#141414]/95 to-transparent">
          
          <NetflixRow title="Daily Quizzes - Updated 24 hours" items={DAILY_QUIZZES} sectionHref="/daily-trivias" />

          <NetflixRow title="Brain Waves - Daily Puzzles" items={BRAIN_WAVES} sectionHref="/brainwave" />

          <div className="px-4 md:px-12">
            <Ads format="fluid" style={{ width: '100%', height: '120px' }} />
          </div>

          {/* DAILY TRIVIA FACT: 
              Now styled to match the page width and mobile padding 
          */}
          <section className="px-4 md:px-12">
            <h2 className="text-gray-300 text-md md:text-xl font-bold mb-4 ml-4 md:ml-4">
              Did You Know?
            </h2>
            <div className="bg-gray-900/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
              <DailyTriviaFact />
            </div>
          </section>

          <NetflixRow title="Retro Classics" items={RETRO_GAMES} sectionHref="/retro-games" />

          <NetflixRow title="Word Games" items={WORD_GAMES} sectionHref="/word-games" />

          <NetflixRow title="Number Puzzles" items={NUMBER_PUZZLES} sectionHref="/number-puzzles" />

          <NetflixRow title="IQ & Personality Tests" items={IQ_PERSONALITY_TESTS} sectionHref="/iq-and-personality-tests" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
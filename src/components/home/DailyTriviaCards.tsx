// src/components/home/DailyTriviaCards.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock, Users, Zap } from 'lucide-react';

export default function DailyTriviaCards() {
  const featuredQuizzes = [
    {
      id: 1,
      title: "Daily Trivia Challenge",
      description: "Test your knowledge across all categories with today's featured quiz",
      questions: 10,
      time: "6 mins",
      players: "5.2K",
      category: "Mixed",
      image: "/imgs/daily-trivias/general-knowledge.webp",
      color: "from-cyan-500 to-blue-600",
      featured: true,
      slug: "general-knowledge",
      difficulty: "Medium"
    },
    {
      id: 2,
      title: "Quick Fire Challenge",
      description: "Blitz through rapid-fire questions in just 60 seconds",
      questions: 7,
      time: "1 min",
      players: "8.3K",
      category: "Quick Fire",
      image: "/imgs/daily-trivias/quick-fire.webp",
      color: "from-orange-500 to-red-600",
      featured: true,
      slug: "quick-fire",
      difficulty: "Hard"
    },
    {
      id: 3,
      title: "Science & Technology",
      description: "Explore the latest in tech and scientific discoveries",
      questions: 10,
      time: "6 mins", 
      players: "3.8K",
      category: "Science",
      image: "/imgs/daily-trivias/science.webp",
      color: "from-green-500 to-emerald-600",
      slug: "science",
      difficulty: "Medium"
    },
    {
      id: 4,
      title: "Movie Mania",
      description: "Blockbusters, classics, and everything in between",
      questions: 10,
      time: "5 min",
      players: "4.5K",
      category: "Entertainment",
      image: "/imgs/daily-trivias/entertainment.webp",
      color: "from-purple-500 to-pink-600",
      slug: "entertainment",
      difficulty: "Easy"
    },
    {
      id: 5,
      title: "Today in History",
      description: "Journey through time and explore historical events",
      questions: 5,
      time: "3 min",
      players: "3.2K",
      category: "History",
      image: "/imgs/daily-trivias/today-history.webp", 
      color: "from-amber-500 to-orange-600",
      slug: "today-in-history",
      difficulty: "Medium"
    },
    {
      id: 6,
      title: "Geography",
      description: "Explore countries, capitals, and landmarks around the world",
      questions: 10,
      time: "5 min",
      players: "3.2K",
      category: "Geography",
      image: "/imgs/daily-trivias/geography.webp", 
      color: "from-blue-500 to-indigo-600",
      slug: "geography",
      difficulty: "Medium"
    },
    {
      id: 7,
      title: "Sports Legends",
      description: "Test your knowledge of sports history and legends",
      questions: 10,
      time: "5 min",
      players: "2.9K",
      category: "Sports",
      image: "/imgs/daily-trivias/sports.webp",
      color: "from-red-500 to-rose-600",
      slug: "sports",
      difficulty: "Easy"
    },
    {
      id: 8,
      title: "Arts and Literature",
      description: "Masterpieces, authors, and artistic movements",
      questions: 10,
      time: "5 min",
      players: "2.9K",
      category: "Arts",
      image: "/imgs/daily-trivias/arts-literature.webp",
      color: "from-amber-500 to-orange-600",
      slug: "arts-literature",
      difficulty: "Hard"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <section className="bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Daily Trivias
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Featured quizzes updated every 24 hours
            </p>
          </div>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="lg:hidden relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {featuredQuizzes.map((quiz) => (
              <Link
                key={quiz.id}
                href={`/daily-trivias/${quiz.slug}`}
                className="flex-none w-[280px] snap-start mr-4 last:mr-0"
              >
                <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group overflow-hidden h-full">
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={quiz.image}
                      alt={quiz.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${quiz.color} opacity-60`} />
                    
                    {/* Featured Badge */}
                    {quiz.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-cyan-400/50">
                          🔥 FEATURED
                        </span>
                      </div>
                    )}
                    
                    {/* Quick Fire Badge */}
                    {quiz.category === 'Quick Fire' && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-orange-400/50 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          QUICK FIRE
                        </span>
                      </div>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-white" fill="white" />
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4">
                    {/* Category and Difficulty */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-cyan-400 text-sm font-medium capitalize">
                        {quiz.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {quiz.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {quiz.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{quiz.questions} Qs</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{quiz.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{quiz.players}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: Two Rows Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
            {/* First Row - First 4 cards */}
            <div className="contents">
              {featuredQuizzes.slice(0, 4).map((quiz) => (
                <Link key={quiz.id} href={`/daily-trivias/${quiz.slug}`}>
                  <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group overflow-hidden">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={quiz.image}
                        alt={quiz.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${quiz.color} opacity-60`} />
                      
                      {/* Featured Badge */}
                      {quiz.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-cyan-400/50">
                            🔥 FEATURED
                          </span>
                        </div>
                      )}
                      
                      {/* Quick Fire Badge */}
                      {quiz.category === 'Quick Fire' && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-orange-400/50 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            QUICK FIRE
                          </span>
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      {/* Category and Difficulty */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-sm font-medium capitalize">
                          {quiz.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {quiz.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {quiz.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>{quiz.questions} Qs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{quiz.players}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Second Row - Next 4 cards */}
            <div className="contents">
              {featuredQuizzes.slice(4, 8).map((quiz) => (
                <Link key={quiz.id} href={`/daily-trivias/${quiz.slug}`}>
                  <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 group overflow-hidden">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={quiz.image}
                        alt={quiz.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent ${quiz.color} opacity-60`} />
                      
                      {/* Featured Badge */}
                      {quiz.featured && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-cyan-400/50">
                            🔥 FEATURED
                          </span>
                        </div>
                      )}
                      
                      {/* Quick Fire Badge */}
                      {quiz.category === 'Quick Fire' && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full border border-orange-400/50 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            QUICK FIRE
                          </span>
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/50 backdrop-blur-sm rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4">
                      {/* Category and Difficulty */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-cyan-400 text-sm font-medium capitalize">
                          {quiz.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(quiz.difficulty)}`}>
                          {quiz.difficulty}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                        {quiz.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {quiz.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span>{quiz.questions} Qs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{quiz.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{quiz.players}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button for Mobile */}
        <div className="mt-8 text-center lg:hidden">
          <Link
            href="/daily-trivias"
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-600"
          >
            View All Quizzes
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
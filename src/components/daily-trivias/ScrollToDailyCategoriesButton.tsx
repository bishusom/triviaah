'use client';

import { Play } from 'lucide-react';

type ScrollToDailyCategoriesButtonProps = {
  targetId: string;
  label?: string;
};

export function ScrollToDailyCategoriesButton({
  targetId,
  label = 'Browse Daily Quizzes',
}: ScrollToDailyCategoriesButtonProps) {
  const scrollToTarget = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTarget}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-900/20 transition-all hover:-translate-y-0.5 hover:shadow-cyan-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 sm:w-auto"
    >
      <Play className="h-4 w-4" />
      {label}
    </button>
  );
}

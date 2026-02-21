import { Suspense } from 'react';
import PlotleGame from './PlotleGame';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const dateParam = params.date;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center">Loading...</div>}>
      <PlotleGame dateParam={dateParam} />
    </Suspense>
  );
}
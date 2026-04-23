'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Play } from 'lucide-react';

type BrainwaveLandingClientProps = {
  game: ReactNode;
  introText?: string;
  headline: string;
  landingImage?: string | null;
  supportingCopy?: string;
  playNotes?: string[];
  readyLabel?: string;
  playLabel?: string;
  backHref?: string;
  backLabel?: string;
};

export default function BrainwaveLandingClient({
  game,
  introText,
  headline,
  landingImage,
  supportingCopy,
  playNotes = [],
  readyLabel = 'Ready when you are',
  playLabel = 'Play Now',
  backHref = '/brainwave',
  backLabel = 'Back to Brainwave',
}: BrainwaveLandingClientProps) {
  const [hasStarted, setHasStarted] = useState(false);

  if (hasStarted) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4">
        {game}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4">
      <div className="rounded-3xl border border-white/10 bg-black/30 p-4 md:p-6 shadow-2xl">
        <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-start">
          {landingImage ? (
            <div className="overflow-hidden rounded-[1.35rem] border border-cyan-400/20 bg-gradient-to-br from-slate-800 to-slate-950 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:max-w-[180px]">
              <div className="relative aspect-square overflow-hidden rounded-[1.2rem] border border-white/10 bg-slate-950/80">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(96,165,250,0.18),transparent_34%),radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_50%_75%,rgba(139,92,246,0.12),transparent_36%)]" />
                <Image
                  src={landingImage}
                  alt={headline}
                  fill
                  sizes="(max-width: 768px) 180px, 180px"
                  className="relative z-10 object-contain p-3 drop-shadow-[0_14px_30px_rgba(0,0,0,0.5)]"
                  priority
                />
              </div>
            </div>
          ) : null}

          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]">
              {readyLabel}
            </p>
            <h2 className="mt-2 text-xl md:text-2xl font-bold text-white">
              {headline}
            </h2>
            {introText ? (
              <p className="mt-2 text-sm leading-6 text-white/75">
                {introText}
              </p>
            ) : null}
            {supportingCopy ? (
              <p className="mt-2 text-sm leading-6 text-white/70">
                {supportingCopy}
              </p>
            ) : null}
            <p className="mt-2 text-sm leading-6 text-white/70">
              Tap play to load today&apos;s puzzle. Once you start, the game board, hints, and feedback tools will appear immediately below.
            </p>

            {playNotes.length ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">
                  How to Play
                </p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/75 md:grid-cols-2">
                  {playNotes.map((note) => (
                    <li key={note} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300/90" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => setHasStarted(true)}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-cyan-400 hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]"
              >
                <Play className="h-4 w-4 fill-current" />
                {playLabel}
              </button>
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition duration-200 hover:bg-white/10 hover:text-white hover:border-cyan-400/30 hover:shadow-[0_0_18px_rgba(34,211,238,0.14)]"
              >
                <ArrowLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

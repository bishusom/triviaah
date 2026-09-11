const ARCHIVE_CARD_GRADIENTS = [
  'from-cyan-950 via-blue-950/90 to-indigo-950/90 hover:from-cyan-900/90 hover:via-blue-900/80 hover:to-indigo-900/80',
  'from-violet-950 via-purple-950/90 to-fuchsia-950/80 hover:from-violet-900/90 hover:via-purple-900/80 hover:to-fuchsia-900/70',
  'from-emerald-950 via-teal-950/90 to-slate-900 hover:from-emerald-900/90 hover:via-teal-900/80 hover:to-slate-800',
  'from-amber-950/95 via-orange-950/90 to-slate-900 hover:from-amber-900/90 hover:via-orange-900/80 hover:to-slate-800',
] as const;

export function getArchiveCardGradient(index: number): string {
  return ARCHIVE_CARD_GRADIENTS[index % ARCHIVE_CARD_GRADIENTS.length];
}

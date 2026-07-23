export function getDictionaryLookupUrl(word: string) {
  return `/api/dictionary?word=${encodeURIComponent(word.trim().toLowerCase())}`;
}

import { supabase } from '@/lib/supabase';

export type GameSection = 'brainwave' | 'word-games' | 'number-puzzles' | 'retro-games';
export type GamePageKind = 'hub' | 'game';

export interface GamePageFaqItem {
  question: string;
  answer: string;
}

export interface GamePageContent {
  id: number;
  route_path: string;
  section: GameSection;
  page_kind: GamePageKind;
  title: string;
  meta_description: string;
  intro_text: string;
  supporting_copy: string;
  og_image: string | null;
  highlights: string[];
  faq_items: GamePageFaqItem[];
  keywords: string[];
  cta_label: string;
  cta_href: string;
  hero_label: string | null;
  landing_headline: string | null;
  play_notes: string[];
  featured: boolean;
  is_daily_refresh: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function toFaqItems(value: unknown): GamePageFaqItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (item): item is GamePageFaqItem =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as GamePageFaqItem).question === 'string' &&
        typeof (item as GamePageFaqItem).answer === 'string',
    )
    .map((item) => ({
      question: item.question,
      answer: item.answer,
    }));
}

export async function getGamePageContent(routePath: string): Promise<GamePageContent | null> {
  const { data, error } = await supabase
    .from('game_pages')
    .select('*')
    .eq('route_path', routePath)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error(`Error loading game page content for ${routePath}:`, error);
    return null;
  }

  if (!data) return null;

  return {
    ...data,
    supporting_copy: data.supporting_copy ?? '',
    og_image: data.og_image ?? null,
    highlights: toStringArray(data.highlights),
    faq_items: toFaqItems(data.faq_items),
    keywords: toStringArray(data.keywords),
    play_notes: toStringArray(data.play_notes),
    featured: Boolean(data.featured),
    landing_headline: data.landing_headline ?? null,
  } as GamePageContent;
}

export async function getGamePagesBySection(section: GameSection): Promise<GamePageContent[]> {
  const { data, error } = await supabase
    .from('game_pages')
    .select('*')
    .eq('section', section)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('title', { ascending: true });

  if (error) {
    console.error(`Error loading game pages for ${section}:`, error);
    return [];
  }

  return (data ?? []).map((item) => ({
    ...item,
    supporting_copy: item.supporting_copy ?? '',
    og_image: item.og_image ?? null,
    highlights: toStringArray(item.highlights),
    faq_items: toFaqItems(item.faq_items),
    keywords: toStringArray(item.keywords),
    play_notes: toStringArray(item.play_notes),
    featured: Boolean(item.featured),
    landing_headline: item.landing_headline ?? null,
  })) as GamePageContent[];
}

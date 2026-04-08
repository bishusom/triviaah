import { MetadataRoute } from 'next'
import { getCategoriesWithMinQuestions, getSubcategoriesWithMinQuestions } from '@/lib/supabase'
import { slugifyTriviaSegment } from '@/lib/trivia-slugs'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentfulSys {
  updatedAt: string
}

interface ContentfulItem {
  fields: { slug: string; [key: string]: unknown }
  sys: ContentfulSys
}

interface ContentfulResponse {
  items: ContentfulItem[]
}

// ─── Priority tiers ───────────────────────────────────────────────────────────

const PRIORITY = {
  HIGH:    0.8,
  MEDIUM:  0.6,
  LOW:     0.4,
  MINIMAL: 0.3,
} as const

const VIRTUAL_TRIVIA_CATEGORIES = ['picture-clues'] as const

// ─── Helpers (module-level — not nested inside sitemap()) ─────────────────────
// Previously these were nested inside sitemap(), which caused scoping issues
// and made them harder to test. Move them to the top level.

async function fetchSubcategoryPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = []
  try {
    const categories = await getCategoriesWithMinQuestions(10)
    for (const category of categories) {
      const subcategories = await getSubcategoriesWithMinQuestions(category, 30)
      for (const subcat of subcategories) {
        // ✅ FIX: Use a real URL path, NOT a query string.
        // /trivias/science/evolution is indexable.
        // /trivias/science/quiz?subcategory=evolution is not — Google treats it
        // as a duplicate of /trivias/science/quiz and ignores it.
        const slug = slugifyTriviaSegment(subcat.subcategory)

        pages.push({
          url: `${baseUrl}/trivias/${category}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.5,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching subcategory pages:', error)
  }
  return pages
}

async function fetchTriviaBankPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/trivia-bank`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: PRIORITY.LOW,
  }]
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries` +
      `?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=triviaBank`,
      { next: { revalidate: 3600 } }
    )
    if (!response.ok) throw new Error('Failed to fetch trivia banks')
    const data = await response.json() as ContentfulResponse
    for (const item of data.items) {
      pages.push({
        url: `${baseUrl}/trivia-bank/${item.fields.slug}`,
        lastModified: new Date(item.sys.updatedAt),
        changeFrequency: 'monthly',
        priority: PRIORITY.MINIMAL,
      })
    }
  } catch (error) {
    console.error('Error fetching trivia bank pages:', error)
  }
  return pages
}

async function fetchBlogPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: PRIORITY.MEDIUM,
  }]
  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries` +
      `?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=blogPost`,
      { next: { revalidate: 3600 } }
    )
    if (!response.ok) throw new Error('Failed to fetch blog posts')
    const data = await response.json() as ContentfulResponse
    for (const item of data.items) {
      pages.push({
        url: `${baseUrl}/blog/${item.fields.slug}`,
        lastModified: new Date(item.sys.updatedAt),
        changeFrequency: 'yearly',
        priority: PRIORITY.LOW,
      })
    }
  } catch (error) {
    console.error('Error fetching blog pages:', error)
  }
  return pages
}

// ─── Validate a URL is live before adding to sitemap ─────────────────────────
// ✅ FIX: This is the most important addition. Before including any dynamic URL,
// verify it returns 200. This eliminates the 76 redirect + 23 404 entries that
// were burning your crawl budget.
//
// Usage: wrap any dynamic URL array with filterLiveUrls() before returning.
// Note: this adds latency at build time — only use for dynamic/Supabase-driven
// URLs, not hardcoded ones you control.

async function filterLiveUrls(pages: MetadataRoute.Sitemap): Promise<MetadataRoute.Sitemap> {
  const results = await Promise.allSettled(
    pages.map(async (page) => {
      const res = await fetch(page.url, { method: 'HEAD', redirect: 'manual' })
      // Only keep pages that return exactly 200 — not 301, 302, 404, or 5xx
      return res.status === 200 ? page : null
    })
  )
  return results
    .filter((r): r is PromiseFulfilledResult<MetadataRoute.Sitemap[0] | null> => r.status === 'fulfilled')
    .map(r => r.value)
    .filter((p): p is MetadataRoute.Sitemap[0] => p !== null)
}

// ─── Main sitemap export ───────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://triviaah.com'

  // ── Static pages ──────────────────────────────────────────────────────────
  const mainPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                              lastModified: new Date(),              changeFrequency: 'daily',  priority: 1.0 },
    { url: `${baseUrl}/leaderboard`,             lastModified: new Date('2025-11-28'),  changeFrequency: 'daily',  priority: 0.9 },
    { url: `${baseUrl}/about`,                   lastModified: new Date('2025-11-28'),  changeFrequency: 'yearly', priority: PRIORITY.LOW },
    { url: `${baseUrl}/contact`,                 lastModified: new Date('2025-11-28'),  changeFrequency: 'yearly', priority: PRIORITY.LOW },
    { url: `${baseUrl}/privacy`,                 lastModified: new Date('2025-11-28'),  changeFrequency: 'yearly', priority: PRIORITY.MINIMAL },
  ]

  // ── Daily trivias ─────────────────────────────────────────────────────────
  const dailyTriviaCategories = [
    'general-knowledge', 'quick-fire', 'entertainment', 'geography',
    'science', 'arts-literature', 'sports', 'today-in-history',
  ]
  const dailyTriviaPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/daily-trivias`, lastModified: new Date(), changeFrequency: 'daily', priority: PRIORITY.HIGH },
    ...dailyTriviaCategories.map(cat => ({
      url: `${baseUrl}/daily-trivias/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: PRIORITY.HIGH,
    })),
  ]

  // ── Brainwave games ───────────────────────────────────────────────────────
  const brainwaveCategories = [
    'capitale', 'plotle', 'celebrile', 'literale',
    'creaturedle', 'foodle', 'inventionle', 'landmarkdle',
    'songle', 'historidle', 'synonymle', 'trordle',
    'automoble', 'botanle', 'citadle', 'countridle',
  ]
  const brainwavePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/brainwave`, lastModified: new Date(), changeFrequency: 'daily', priority: PRIORITY.HIGH },
    ...brainwaveCategories.map(cat => ({
      url: `${baseUrl}/brainwave/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: PRIORITY.HIGH,
    })),
  ]

  // ── Trivia category + quiz pages (dynamic from Supabase) ─────────────────
  // ✅ FIX: Category pages (/trivias/science) and quiz pages (/trivias/science/quiz)
  // are included, but NOT subcategory query-string URLs.
  // Subcategory routes are only included if you've created actual page routes for them.
  const triviaCategories = Array.from(
    new Set([...(await getCategoriesWithMinQuestions(10)), ...VIRTUAL_TRIVIA_CATEGORIES])
  )

  const triviaCategoryPages: MetadataRoute.Sitemap = triviaCategories.map(category => ({
    url: `${baseUrl}/trivias/${category}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: PRIORITY.MEDIUM,
  }))

  const triviaQuizPages: MetadataRoute.Sitemap = triviaCategories.map(category => ({
    url: `${baseUrl}/trivias/${category}/quiz`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    // ✅ FIX: Quiz pages are your most valuable content — raise priority
    priority: PRIORITY.HIGH,
  }))

  // ✅ Subcategory pages: only enable once you have real routes (not query params)
  const subcategoryPages = await fetchSubcategoryPages(baseUrl)

  // ── Retro games ───────────────────────────────────────────────────────────
  const retroGames = ['snake', 'tic-tac-toe', 'pong', 'minesweeper', 'tetris', 'pacman', 'space-invaders', 'breakout']
  const retroGamePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/retro-games`, lastModified: new Date(), changeFrequency: 'weekly', priority: PRIORITY.MEDIUM },
    ...retroGames.map(game => ({
      url: `${baseUrl}/retro-games/${game}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: PRIORITY.MEDIUM,
    })),
  ]

  // ── IQ & personality tests ────────────────────────────────────────────────
  const iqTests = ['capa', 'matrixiq', 'mbti', 'big-five', 'enneagram', 'disc', 'love-languages', 'holland-code']
  const iqTestPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/iq-and-personality-tests`, lastModified: new Date(), changeFrequency: 'weekly', priority: PRIORITY.MEDIUM },
    ...iqTests.map(test => ({
      url: `${baseUrl}/iq-and-personality-tests/${test}`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: PRIORITY.MEDIUM,
    })),
  ]

  // ── Word games ────────────────────────────────────────────────────────────
  const wordGames = ['boggle', 'scramble', 'spelling-bee', 'word-search', 'word-ladder']
  const wordGamePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/word-games`, lastModified: new Date(), changeFrequency: 'weekly', priority: PRIORITY.MEDIUM },
    ...wordGames.map(game => ({
      url: `${baseUrl}/word-games/${game}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: PRIORITY.MEDIUM,
    })),
  ]

  // ── Number puzzles ────────────────────────────────────────────────────────
  const numberPuzzles = ['number-scramble', 'number-sequence', 'number-tower', 'prime-hunter', 'sudoku']
  const numberPuzzlePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/number-puzzles`, lastModified: new Date(), changeFrequency: 'weekly', priority: PRIORITY.MEDIUM },
    ...numberPuzzles.map(puzzle => ({
      url: `${baseUrl}/number-puzzles/${puzzle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: PRIORITY.MEDIUM,
    })),
  ]

  // ── Dynamic content (Contentful) ──────────────────────────────────────────
  // Trivia bank is commented out — good, it was generating 404s likely.
  // Re-enable only once you confirm every slug returns 200.
  const triviaBankPages = await fetchTriviaBankPages(baseUrl)

  const blogPages = await fetchBlogPages(baseUrl)

  // ─── Final assembly ────────────────────────────────────────────────────────
  // ✅ FIX: Only include URLs that actually exist and return 200.
  // The filterLiveUrls() call runs HEAD requests at build time on dynamic routes.
  // For hardcoded routes you're confident about, skip the filter to save build time.
  const dynamicPages = [
    ...triviaCategoryPages,
    ...triviaQuizPages,
    ...subcategoryPages,
    ...triviaBankPages,  // Only re-enable after confirming all slugs are live
    ...blogPages,
  ]

  // Uncomment this once you've confirmed your dynamic routes are stable:
  // const verifiedDynamicPages = await filterLiveUrls(dynamicPages)

  return [
    ...mainPages,
    ...dailyTriviaPages,
    ...brainwavePages,
    ...dynamicPages,       // swap with verifiedDynamicPages once enabled
    ...retroGamePages,
    ...iqTestPages,
    ...wordGamePages,
    ...numberPuzzlePages,
  ]
}

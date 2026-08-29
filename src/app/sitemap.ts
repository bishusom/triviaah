export const revalidate = 3600;
import { MetadataRoute } from 'next'
import { getBrainwaveRouteDefinitions } from '@/lib/brainwave/brainwave-route-registry'
import { getWeeklyChallenges } from '@/lib/challenges'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentfulSys {
  updatedAt: string
}

interface ContentfulItem {
  fields: { slug: string;[key: string]: unknown }
  sys: ContentfulSys
}

interface ContentfulResponse {
  items: ContentfulItem[]
}

// ─── Priority tiers ───────────────────────────────────────────────────────────

const PRIORITY = {
  HIGH: 0.8,
  MEDIUM: 0.6,
  LOW: 0.4,
  MINIMAL: 0.3,
} as const

const FEATURED_DAILY_TRIVIA_CATEGORIES = [
  'general-knowledge',
  'quick-fire',
  'today-in-history',
  'entertainment',
  'sports',
  'nature',
] as const

const FEATURED_BRAINWAVE_SLUGS = [
  'plotle',
  'capitale',
  'historidle',
  'celebrile',
  'songle',
  'literale',
] as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

async function fetchChallengePages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  try {
    const challenges = await getWeeklyChallenges()

    return challenges.map(challenge => ({
      url: `${baseUrl}/challenges/${challenge.slug}`,
      lastModified: challenge.createdAt ? new Date(challenge.createdAt) : new Date(),
      changeFrequency: challenge.status === 'active' ? 'weekly' as const : 'monthly' as const,
      priority: challenge.status === 'active' ? PRIORITY.HIGH : PRIORITY.MEDIUM,
    }))
  } catch (error) {
    console.error('Error fetching challenge pages:', error)
    return []
  }
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
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/challenges`, lastModified: new Date(), changeFrequency: 'weekly', priority: PRIORITY.HIGH },
    { url: `${baseUrl}/leaderboard`, lastModified: new Date('2025-11-28'), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date('2025-11-28'), changeFrequency: 'yearly', priority: PRIORITY.LOW },
    { url: `${baseUrl}/contact`, lastModified: new Date('2025-11-28'), changeFrequency: 'yearly', priority: PRIORITY.LOW },
    { url: `${baseUrl}/privacy`, lastModified: new Date('2025-11-28'), changeFrequency: 'yearly', priority: PRIORITY.MINIMAL },
    { url: `${baseUrl}/terms`, lastModified: new Date('2025-11-28'), changeFrequency: 'yearly', priority: PRIORITY.MINIMAL },
  ]

  // ── Daily trivias ─────────────────────────────────────────────────────────
  const dailyTriviaPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/daily-trivias`, lastModified: new Date(), changeFrequency: 'daily', priority: PRIORITY.HIGH },
    ...FEATURED_DAILY_TRIVIA_CATEGORIES.map(cat => ({
      url: `${baseUrl}/daily-trivias/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: PRIORITY.HIGH,
    })),
  ]

  // ── Brainwave games ───────────────────────────────────────────────────────
  const featuredBrainwaveSlugs = new Set<string>(FEATURED_BRAINWAVE_SLUGS)
  const brainwaveCategories = getBrainwaveRouteDefinitions()
    .map(page => page.slug)
    .filter(slug => featuredBrainwaveSlugs.has(slug))
  const brainwavePages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/brainwave`, lastModified: new Date(), changeFrequency: 'daily', priority: PRIORITY.HIGH },
    ...brainwaveCategories.map(cat => ({
      url: `${baseUrl}/brainwave/${cat}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: PRIORITY.HIGH,
    })),
  ]

  // ── Dynamic editorial content ────────────────────────────────────────────
  const [
    triviaBankPages,
    blogPages,
    challengePages,
  ] = await Promise.all([
    fetchTriviaBankPages(baseUrl),
    fetchBlogPages(baseUrl),
    fetchChallengePages(baseUrl),
  ])

  // ─── Final assembly ────────────────────────────────────────────────────────
  const dynamicPages = [
    ...triviaBankPages,  // Only re-enable after confirming all slugs are live
    ...blogPages,
    ...challengePages,
  ]

  // Uncomment this once you've confirmed your dynamic routes are stable:
  // const verifiedDynamicPages = await filterLiveUrls(dynamicPages)

  return [
    ...mainPages,
    ...dailyTriviaPages,
    ...brainwavePages,
    ...dynamicPages,       // swap with verifiedDynamicPages once enabled
  ]
}

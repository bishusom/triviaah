import { MetadataRoute } from 'next'
import { getCategoriesWithMinQuestions, getSubcategoriesWithMinQuestions } from '@/lib/supabase'
import { getCurrentMonthQuiz, SPECIAL_QUIZZES } from '@/config/special-quizzes' // Add this import

// Contentful response types
interface ContentfulSys {
  updatedAt: string
}

interface ContentfulItem {
  fields: {
    slug: string
    [key: string]: unknown
  }
  sys: ContentfulSys
}

interface ContentfulResponse {
  items: ContentfulItem[]
}

// Priority tiers based on content value and user engagement
const PRIORITY_TIERS = {
  HIGH: 0.8,      // Main interactive features (quizzes, games)
  MEDIUM: 0.6,    // Category pages, blog index
  LOW: 0.4,       // Static pages, individual blog posts
  MINIMAL: 0.3    // Archive pages, older content
} as const;

function getMonthName(monthNumber: number): string {
  return new Date(2000, monthNumber - 1, 1).toLocaleString('default', { month: 'long' });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://triviaah.com'
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Static main pages - REALISTIC priorities
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2025-12-01'), // Use actual last update
      changeFrequency: 'yearly',
      priority: PRIORITY_TIERS.LOW,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'yearly',
      priority: PRIORITY_TIERS.LOW,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'yearly',
      priority: PRIORITY_TIERS.MINIMAL,
    },
  ]

  // Daily trivias - HIGH priority (core feature)
  const dailyTriviasCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/daily-trivias`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: PRIORITY_TIERS.HIGH,
  }]

  const dailyTriviaCategories = [
    'general-knowledge', 'entertainment', 'geography', 
    'science', 'arts-literature', 'sports'
  ]

  const dailyTriviaCategoryPages: MetadataRoute.Sitemap = dailyTriviaCategories.map(category => ({
    url: `${baseUrl}/daily-trivias/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: PRIORITY_TIERS.HIGH,
  }))

  // Other daily features - HIGH priority
  const otherDailyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/quick-fire`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: PRIORITY_TIERS.HIGH,
    },
    {
      url: `${baseUrl}/today-in-history`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: PRIORITY_TIERS.HIGH,
    },
  ]

  // Brainwave games - MEDIUM priority
  const brainwaveCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/brainwave`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: PRIORITY_TIERS.MEDIUM,
  }]

  const brainwaveCategories = [
    'capitale', 'plotle', 'celebrile', 'literale',
    'creaturedle', 'foodle', 'inventionle', 'landmarkdle',
    'songle', 'historidle', 'synonymle', 'trordle',
    'automoble', 'countridle', 'citadle', 'botanle'
  ]

  const brainwaveCategoryPages: MetadataRoute.Sitemap = brainwaveCategories.map(category => ({
    url: `${baseUrl}/brainwave/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: PRIORITY_TIERS.MEDIUM,
  }))

  // 🆕 SPECIAL QUIZZES - Monthly rotating content
  const specialQuizzesCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/special-quizzes`,
    lastModified: new Date(),
    changeFrequency: 'monthly', // Updates when month changes
    priority: PRIORITY_TIERS.MEDIUM,
  }]

  // Get current month's quiz for inclusion in sitemap
  const currentMonthQuiz = getCurrentMonthQuiz();
  
  // Only include the current month's quiz in sitemap (others are not accessible)
  const specialQuizPages: MetadataRoute.Sitemap = currentMonthQuiz ? [{
    url: `${baseUrl}/special-quizzes/${currentMonthQuiz.category}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: PRIORITY_TIERS.MEDIUM,
    // Optional: Add more metadata if needed
    // i.e., `<xhtml:link rel="alternate" hreflang="en" href="..."/>`
  }] : [];

  // DYNAMIC: Fetch trivia categories - MEDIUM priority for category pages
  const triviaCategories = await getCategoriesWithMinQuestions(10)
  
  const triviaCategoryPages: MetadataRoute.Sitemap = triviaCategories.map(category => ({
    url: `${baseUrl}/trivias/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly', // More realistic than daily
    priority: PRIORITY_TIERS.MEDIUM,
  }))

  // Quiz pages - HIGH priority (main interactive content)
  const triviaQuizPages: MetadataRoute.Sitemap = triviaCategories.map(category => ({
    url: `${baseUrl}/trivias/${category}/quiz`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: PRIORITY_TIERS.HIGH,
  }))

   
  // Word games - MEDIUM priority
  const iQPersonalityTestsCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/iq-and-personality-tests`,
    lastModified: new Date('2025-12-02'),
    changeFrequency: 'yearly',
    priority: PRIORITY_TIERS.MEDIUM,
  }]

  const iQPersonalityTests = ['capa', 'matrixiq', 'mbti', 'big-five', 'enneagram', 'disc', 'love-languages', 'holland-code']
  const iQPersonalityTestsPages: MetadataRoute.Sitemap = iQPersonalityTests.map(test => ({
    url: `${baseUrl}/iq-and-personality-tests/${test}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: PRIORITY_TIERS.MEDIUM,
  }))


  // DYNAMIC: Subcategory pages - MEDIUM priority
  const subcategoryPages = await fetchSubcategoryPages(baseUrl)

  // Word games - MEDIUM priority
  const wordGamesCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/word-games`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: PRIORITY_TIERS.MEDIUM,
  }]

  const wordGames = ['boggle', 'scramble', 'spelling-bee', 'word-search', 'word-ladder', 'mini-crossword']
  const wordGamePages: MetadataRoute.Sitemap = wordGames.map(game => ({
    url: `${baseUrl}/word-games/${game}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: PRIORITY_TIERS.MEDIUM,
  }))

  // Number puzzles - MEDIUM priority
  const numberPuzzleCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/number-puzzles`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: PRIORITY_TIERS.MEDIUM,
  }]

  const numberPuzzles = ['number-scramble', 'number-sequence', 'number-tower', 'prime-hunter', 'sudoku', 'kakuro']
  const numberPuzzlePages: MetadataRoute.Sitemap = numberPuzzles.map(puzzle => ({
    url: `${baseUrl}/number-puzzles/${puzzle}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: PRIORITY_TIERS.MEDIUM,
  }))

  // DYNAMIC: Trivia bank - LOW priority (archive content)
  const triviaBankPages = await fetchTriviaBankPages(baseUrl)

  // DYNAMIC: Blog posts - MEDIUM for index, LOW for individual
  const blogPages = await fetchBlogPages(baseUrl)

  // Combine all routes with realistic priorities
  return [
    ...mainPages,
    ...dailyTriviasCatalog,
    ...dailyTriviaCategoryPages,
    ...otherDailyPages,
    ...specialQuizzesCatalog,     // 🆕 Added special quizzes catalog
    ...specialQuizPages,          // 🆕 Added current month's special quiz
    ...brainwaveCatalog,
    ...brainwaveCategoryPages,
    ...triviaCategoryPages,
    ...triviaQuizPages,
    ...subcategoryPages,
    ...iQPersonalityTestsCatalog,
    ...iQPersonalityTestsPages,
    ...wordGamesCatalog,
    ...wordGamePages,
    ...numberPuzzleCatalog,
    ...numberPuzzlePages,
    ...triviaBankPages,
    ...blogPages
  ]
}

// Updated subcategory pages with realistic priorities
async function fetchSubcategoryPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = []

  try {
    const categories = await getCategoriesWithMinQuestions(10)
    
    for (const category of categories) {
      const subcategories = await getSubcategoriesWithMinQuestions(category, 30)
      
      for (const subcat of subcategories) {
        pages.push({
          url: `${baseUrl}/trivias/${category}/quiz?subcategory=${encodeURIComponent(subcat.subcategory)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly', // More realistic
          priority: 0.5, // Lower than main quiz pages
        })
      }
    }
  } catch (error) {
    console.error('Error fetching subcategory pages:', error)
  }

  return pages
}

// Updated trivia bank with lower priorities
async function fetchTriviaBankPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/trivia-bank`,
      lastModified: new Date(),
      changeFrequency: 'monthly', // Archive content changes rarely
      priority: PRIORITY_TIERS.LOW,
    },
  ]

  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=triviaBank`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) throw new Error('Failed to fetch trivia banks')

    const data = await response.json() as ContentfulResponse

    data.items.forEach((item: ContentfulItem) => {
      const slug = item.fields.slug
      const updatedAt = item.sys.updatedAt

      pages.push({
        url: `${baseUrl}/trivia-bank/${slug}`,
        lastModified: new Date(updatedAt),
        changeFrequency: 'monthly', // Static content
        priority: PRIORITY_TIERS.MINIMAL, // Lowest priority - archive content
      })
    })
  } catch (error) {
    console.error('Error fetching trivia bank pages:', error)
  }

  return pages
}

// Updated blog with realistic priorities
async function fetchBlogPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: PRIORITY_TIERS.MEDIUM,
    },
  ]

  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=blogPost`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) throw new Error('Failed to fetch blog posts')

    const data = await response.json() as ContentfulResponse

    data.items.forEach((item: ContentfulItem) => {
      const slug = item.fields.slug
      const updatedAt = item.sys.updatedAt

      pages.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(updatedAt),
        changeFrequency: 'yearly', // Blog posts rarely updated
        priority: PRIORITY_TIERS.LOW, // Individual posts lower priority
      })
    })
  } catch (error) {
    console.error('Error fetching blog pages:', error)
  }

  return pages
}
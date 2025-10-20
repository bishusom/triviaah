import { MetadataRoute } from 'next'
import { getAllCategoriesWithSubcategories, getCategoriesWithMinQuestions, getSubcategoriesWithMinQuestions } from '@/lib/supabase'

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://triviaah.com'

  // Static main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]

  const DailytriviasCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/daily-trivias`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }]

  const DailytriviaCategories = [
    'general-knowledge', 'entertainment', 'geography', 
    'science', 'arts-literature', 'sports'
  ]

  const DailytriviaCategoryPages: MetadataRoute.Sitemap = DailytriviaCategories.map(category => ({
    url: `${baseUrl}/daily-trivias/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // Two other daily trivia pages
  const otherDailyTriviaPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/quick-fire`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/today-in-history`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  DailytriviaCategoryPages.push(...otherDailyTriviaPages)

  const brainwaveCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/brainwave`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }]

  const brainwaveCategories = [
    'capitale', 'plotle', 'celebrile', 'literale', 
    'songle', 'historidle', 'synonymle', 'troridle'
  ]

  const brainwaveCategoryPages: MetadataRoute.Sitemap = brainwaveCategories.map(category => ({
    url: `${baseUrl}/brainwave/${category}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  // DYNAMIC: Fetch trivia categories from Supabase (with minimum questions)
  const triviaCategories = await getCategoriesWithMinQuestions(10)
  
  const triviaCategoryPages: MetadataRoute.Sitemap = triviaCategories.map(category => ({
    url: `${baseUrl}/trivias/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Add quiz pages for each category
  const triviaQuizPages: MetadataRoute.Sitemap = triviaCategories.map(category => ({
    url: `${baseUrl}/trivias/${category}/quiz`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }))

  // DYNAMIC: Fetch subcategory pages (only those with >= 30 questions)
  const subcategoryPages = await fetchSubcategoryPages(baseUrl)

  // Word games (static)
  const wordGames = [ 'boggle', 'scramble', 'spelling-bee', 'word-search', 'word-ladder']
  const wordGamePages: MetadataRoute.Sitemap = wordGames.flatMap(game => [
    {
      url: `${baseUrl}/word-games/${game}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ])

  const wordGamesCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/word-games`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }]

  // Number puzzles (static)
  const numberPuzzles = ['number-scramble', 'number-sequence', 'number-tower', 'prime-hunter', 'sodoku']
  const numberPuzzlePages: MetadataRoute.Sitemap = numberPuzzles.flatMap(puzzle => [
    {
      url: `${baseUrl}/number-puzzles/${puzzle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ])

  const numberPuzzleCatalog: MetadataRoute.Sitemap = [{
    url: `${baseUrl}/number-puzzles`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }]

  // DYNAMIC: Fetch trivia bank entries
  const triviaBankPages = await fetchTriviaBankPages(baseUrl)

  // DYNAMIC: Fetch blog posts
  const blogPages = await fetchBlogPages(baseUrl)

  // Combine all routes
  return [
    ...mainPages,
    ...DailytriviasCatalog,
    ...DailytriviaCategoryPages,
    ...brainwaveCatalog,
    ...brainwaveCategoryPages,
    ...triviaCategoryPages,
    ...triviaQuizPages,
    ...subcategoryPages,
    ...wordGamesCatalog,
    ...wordGamePages,
    ...numberPuzzleCatalog,
    ...numberPuzzlePages,
    ...triviaBankPages,
    ...blogPages
  ]
}

// Updated function to fetch subcategory pages with minimum 30 questions
async function fetchSubcategoryPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = []

  try {
    // Get all categories first
    const categories = await getCategoriesWithMinQuestions(10)
    
    // For each category, get subcategories with at least 30 questions
    for (const category of categories) {
      const subcategories = await getSubcategoriesWithMinQuestions(category, 30)
      
      for (const subcat of subcategories) {
        // Add subcategory quiz page
        pages.push({
          url: `${baseUrl}/trivias/${category}/quiz?subcategory=${encodeURIComponent(subcat.subcategory)}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching subcategory pages:', error)
  }

  return pages
}

// Dynamic function to fetch trivia bank pages from Contentful
async function fetchTriviaBankPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/trivia-bank`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    // Fetch from Contentful
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=triviaBank`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error('Failed to fetch trivia banks from Contentful')
    }

    const data = await response.json() as ContentfulResponse

    data.items.forEach((item: ContentfulItem) => {
      const slug = item.fields.slug
      const updatedAt = item.sys.updatedAt

      pages.push({
        url: `${baseUrl}/trivia-bank/${slug}`,
        lastModified: new Date(updatedAt),
        changeFrequency: 'monthly',
        priority: 0.64,
      })
    })
  } catch (error) {
    console.error('Error fetching trivia bank pages from Contentful:', error)
  }

  return pages
}

// Dynamic function to fetch blog posts from Contentful
async function fetchBlogPages(baseUrl: string): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  try {
    // Fetch from Contentful
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/master/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=blogPost`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts from Contentful')
    }

    const data = await response.json() as ContentfulResponse

    data.items.forEach((item: ContentfulItem) => {
      const slug = item.fields.slug
      const updatedAt = item.sys.updatedAt

      pages.push({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(updatedAt),
        changeFrequency: 'monthly',
        priority: 0.64,
      })
    })
  } catch (error) {
    console.error('Error fetching blog pages from Contentful:', error)
  }

  return pages
}
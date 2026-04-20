import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const outputPath = path.join(rootDir, 'supabase', 'trivia_categories_seed.sql');
const subcategoryCsvPath = path.join(process.env.HOME || '', 'Downloads', 'trivia-subcategories.csv');

function slugifyTriviaSegment(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeSqlString(value) {
  return String(value).replace(/'/g, "''");
}

function sqlText(value) {
  return `'${escapeSqlString(value)}'`;
}

function sqlJson(value) {
  return `'${escapeSqlString(JSON.stringify(value))}'::jsonb`;
}

function buildDailyFaqItems(title) {
  const lower = title.toLowerCase();
  return [
    {
      icon: '🔄',
      title: 'How often are new questions available?',
      answer: `New ${lower} trivia questions are available every day. Come back daily for a fresh challenge.`,
    },
    {
      icon: '💰',
      title: `Is the ${title} daily quiz free?`,
      answer: `Yes. The ${lower} daily trivia quiz is completely free to play with no registration required.`,
    },
    {
      icon: '⏱️',
      title: 'How long does a round take?',
      answer: `Most ${lower} daily quizzes take only a few minutes to finish, so they fit easily into a short break.`,
    },
    {
      icon: '🎯',
      title: 'What kind of questions will I see?',
      answer: `You will see a curated mix of ${lower} questions designed to be interesting, accessible, and updated regularly.`,
    },
    {
      icon: '🏆',
      title: 'Can I replay the quiz?',
      answer: 'Yes. You can replay the quiz to improve your score or challenge yourself again later.',
    },
    {
      icon: '📚',
      title: 'What is the quiz good for?',
      answer: 'It is a quick way to sharpen your knowledge while learning a few new facts along the way.',
    },
  ];
}

function parseCsv(text) {
  const rows = [];
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift());

  for (const line of lines) {
    if (!line.trim()) continue;
    const cells = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? '';
    });
    rows.push(row);
  }

  return rows;
}

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      cells.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

const dailyCategories = [
  {
    categoryType: 'daily-trivias',
    slug: 'quick-fire',
    title: 'Quick Fire',
    description: 'Race the clock with our Quick Fire daily trivia — 6 questions, 15 seconds each. New challenge every 24 hours.',
    longDescription: 'The Quick Fire challenge is designed for those who think fast under pressure. Featuring a rotating mix of science, history, and pop culture, this high-intensity quiz forces you to rely on your gut instinct. With only 15 seconds per question, it is the ultimate test of cognitive recall and rapid decision-making.',
    learningPoints: [
      'Improve cognitive recall speed and mental agility.',
      'Identify core facts across a diverse range of general knowledge topics.',
      'Master the art of performing accurately under strict time constraints.',
    ],
    faqItems: buildDailyFaqItems('Quick Fire'),
    related: ['science', 'history', 'movies'],
    keywords: ['rapid fire trivia', 'quick fire trivia', 'quick trivia quiz', 'daily trivia'],
    ogImage: '/imgs/daily-trivias/quick-fire.webp',
    displayName: 'Quick Fire',
    icon: '⚡',
    color: 'from-orange-500 to-red-500',
    showPrintableQuizCTA: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    categoryType: 'daily-trivias',
    slug: 'general-knowledge',
    title: 'General Knowledge',
    description: 'Test your worldly wisdom with 10 free daily general knowledge trivia questions. Refreshed every day.',
    longDescription: 'Our General Knowledge daily quiz is a curated journey through the most interesting facts on Earth. We cover everything from obscure historical milestones to the latest scientific breakthroughs. This quiz is perfect for lifelong learners who want to broaden their intellectual horizons and stay sharp on a global scale.',
    learningPoints: [
      'Broaden your understanding of global history and current events.',
      'Connect disparate facts between science, culture, and geography.',
      'Build a versatile knowledge base for social and professional settings.',
    ],
    faqItems: buildDailyFaqItems('General Knowledge'),
    related: ['science', 'history', 'geography'],
    keywords: ['general knowledge quiz', 'daily trivia facts', 'world trivia questions'],
    ogImage: '/imgs/daily-trivias/general-knowledge.webp',
    displayName: 'General Knowledge',
    icon: '🌎',
    color: 'from-blue-500 to-cyan-500',
    showPrintableQuizCTA: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    categoryType: 'daily-trivias',
    slug: 'today-in-history',
    title: 'Today in History',
    description: 'Discover what happened on this day in history — free daily trivia with 10 questions on famous birthdays and milestones.',
    longDescription: 'Every day is an anniversary of something monumental. This daily history quiz dives into the archives to bring you the battles, discoveries, and births that happened on this exact calendar date. It is a unique way to contextualize the modern world by understanding the specific events that shaped it over centuries.',
    learningPoints: [
      "Identify pivotal historical milestones that occurred on today's date.",
      'Understand the chronological connection between past and present.',
      'Learn about influential figures and their contributions to global history.',
    ],
    faqItems: buildDailyFaqItems('Today in History'),
    related: ['history', 'famous-quotes', 'inventions'],
    keywords: ['historical trivia quiz', 'on this day trivia', 'history facts game'],
    ogImage: '/imgs/daily-trivias/today-in-history.webp',
    displayName: 'Today in History',
    icon: '📅',
    color: 'from-amber-500 to-orange-500',
    showPrintableQuizCTA: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    categoryType: 'daily-trivias',
    slug: 'entertainment',
    title: 'Entertainment',
    description: 'Daily entertainment trivia — movies, music, TV shows, and celebrity questions. 10 free questions refreshed every 24 hours.',
    longDescription: 'Stay updated with the world of glitz and glamour. Our entertainment daily quiz tracks the evolution of cinema, the biggest hits on the music charts, and the legends of the small screen. From Hollywood’s Golden Age to the latest viral streaming sensations, we test your grasp of the arts and media.',
    learningPoints: [
      'Track the evolution of film, television, and musical trends.',
      'Identify award-winning performances and iconic pop culture moments.',
      'Understand the impact of media on modern society and fashion.',
    ],
    faqItems: buildDailyFaqItems('Entertainment'),
    related: ['movies', 'music', 'tv', 'celebrities'],
    keywords: ['pop culture trivia quiz', 'movie trivia game', 'celebrity quiz'],
    ogImage: '/imgs/daily-trivias/entertainment.webp',
    displayName: 'Entertainment',
    icon: '🎬',
    color: 'from-purple-500 to-pink-500',
    showPrintableQuizCTA: true,
    sortOrder: 4,
    isActive: true,
  },
  {
    categoryType: 'daily-trivias',
    slug: 'geography',
    title: 'Geography',
    description: 'Free daily geography trivia — countries, capitals, flags, and world landmarks. 10 fresh questions every day.',
    longDescription: 'Explore the world without leaving your home. Our daily geography challenge goes beyond simple capitals to explore tectonic shifts, climatic zones, and cultural landmarks. It is designed to help you visualize the planet and understand the physical and political borders that define our global community.',
    learningPoints: [
      'Master the locations of countries, capitals, and major landmarks.',
      'Identify the physical features and biomes of different continents.',
      'Understand the demographic and political shifts in global geography.',
    ],
    faqItems: buildDailyFaqItems('Geography'),
    related: ['history', 'animals', 'science'],
    keywords: ['geography trivia quiz', 'world capitals game', 'countries trivia'],
    ogImage: '/imgs/daily-trivias/geography.webp',
    displayName: 'Geography',
    icon: '🗺️',
    color: 'from-green-500 to-emerald-500',
    showPrintableQuizCTA: true,
    sortOrder: 5,
    isActive: true,
  },
  {
    categoryType: 'daily-trivias',
    slug: 'science',
    title: 'Science & Nature',
    description: 'Daily science and nature trivia — biology, physics, space exploration, and the animal kingdom.',
    longDescription: 'Unlock the mysteries of the universe with our daily science quiz. Whether we are discussing the microscopic world of cellular biology or the vast expanses of quantum physics and astronomy, these questions are designed to stimulate your curiosity and explain the mechanics of the natural world.',
    learningPoints: [
      'Comprehend fundamental laws of physics and chemical reactions.',
      "Explore the diversity of the animal kingdom and Earth's ecosystems.",
      'Learn about the latest breakthroughs in space exploration and technology.',
    ],
    faqItems: buildDailyFaqItems('Science & Nature'),
    related: ['animals', 'inventions', 'geography'],
    keywords: ['science trivia quiz', 'biology quiz game', 'physics trivia questions'],
    ogImage: '/imgs/daily-trivias/science.webp',
    displayName: 'Science & Nature',
    icon: '🔬',
    color: 'from-cyan-500 to-blue-500',
    showPrintableQuizCTA: true,
    sortOrder: 6,
    isActive: true,
  },
  {
    categoryType: 'daily-trivias',
    slug: 'arts-literature',
    title: 'Arts & Literature',
    description: 'Free daily arts and literature trivia — great authors, artists, famous paintings, and classic books.',
    longDescription: 'Feed your soul with our daily arts and literature trivia. We explore the brushstrokes of Renaissance masters and the profound prose of Nobel-winning authors. This quiz challenges you to recognize the creative milestones that have defined human expression across centuries and cultures.',
    learningPoints: [
      'Recognize the stylistic differences between major art movements.',
      'Identify the themes and authors of world-renowned literary classics.',
      'Understand the historical context behind iconic works of art and drama.',
    ],
    faqItems: buildDailyFaqItems('Arts & Literature'),
    related: ['literature', 'arts', 'famous-quotes'],
    keywords: ['literature trivia quiz', 'famous authors quiz', 'art history questions'],
    ogImage: '/imgs/daily-trivias/arts-literature.webp',
    displayName: 'Arts & Literature',
    icon: '🎨',
    color: 'from-pink-500 to-rose-500',
    showPrintableQuizCTA: true,
    sortOrder: 7,
    isActive: true,
  },
  {
    categoryType: 'daily-trivias',
    slug: 'sports',
    title: 'Sports',
    description: 'Daily sports trivia — athletes, records, championships, and iconic sporting moments. 10 free questions refreshed every 24 hours.',
    longDescription: 'For the ultimate sports fan, this daily quiz is your playing field. We cover the strategy of the pitch, the stats of the court, and the legends of the Olympic track. Test your knowledge of record-breaking performances and the history of global competitions from football to tennis.',
    learningPoints: [
      'Recall major sports records, championships, and iconic moments.',
      'Identify the career achievements of legendary athletes.',
      'Understand the rules and historical origins of various global sports.',
    ],
    faqItems: buildDailyFaqItems('Sports'),
    related: ['sports', 'famous-firsts', 'celebrities'],
    keywords: ['sports trivia quiz', 'athlete trivia', 'sports history game'],
    ogImage: '/imgs/daily-trivias/sports.webp',
    displayName: 'Sports',
    icon: '⚽',
    color: 'from-red-500 to-orange-500',
    showPrintableQuizCTA: true,
    sortOrder: 8,
    isActive: true,
  },
];

const legacyTriviaCategories = JSON.parse(
  execSync('git show HEAD:src/config/triviaCategories.json', { encoding: 'utf8' })
);

const triviaCategoryRows = Object.entries(legacyTriviaCategories).map(([slug, value], index) => {
  const row = value;
  const related = Array.isArray(row.related) ? row.related : [];
  const normalizedRelated = related.map((item) => (item === 'law-politics-government' ? 'law-politics' : item));

  return {
    categoryType: 'trivias',
    slug,
    title: row.title,
    description: row.description,
    longDescription: row.longDescription,
    learningPoints: row.learningPoints ?? [],
    related: normalizedRelated,
    keywords: row.keywords ?? [],
    ogImage: row.ogImage ?? null,
    displayName: row.displayName ?? row.title,
    icon: null,
    color: null,
    showPrintableQuizCTA: row.showPrintableQuizCTA ?? true,
    sortOrder: index + 1,
    isActive: true,
  };
});

const subcategoryCsv = fs.readFileSync(subcategoryCsvPath, 'utf8');
const subcategoryRows = parseCsv(subcategoryCsv);
const subcategorySortOrderByCategory = new Map();

const triviaSubcategoryRows = subcategoryRows.map((row) => {
  const categorySlug = row.category.trim();
  const currentSortOrder = (subcategorySortOrderByCategory.get(categorySlug) ?? 0) + 1;
  subcategorySortOrderByCategory.set(categorySlug, currentSortOrder);

  return {
    categoryType: 'trivias',
    categorySlug,
    subcategory: row.subcategory.trim(),
    slug: slugifyTriviaSegment(row.subcategory.trim()),
    questionCount: Number(row.question_count || 0),
    sortOrder: currentSortOrder,
    isActive: true,
  };
});

function buildCategoryInsert(rows) {
  const columns = [
    'category_type',
    'slug',
    'title',
    'description',
    'long_description',
    'learning_points',
    'faq_items',
    'related',
    'keywords',
    'og_image',
    'display_name',
    'icon',
    'color',
    'show_printable_quiz_cta',
    'sort_order',
    'is_active',
  ];

  const values = rows
    .map((row) => `(${[
      sqlText(row.categoryType),
      sqlText(row.slug),
      sqlText(row.title),
      sqlText(row.description),
      sqlText(row.longDescription),
      sqlJson(row.learningPoints),
      sqlJson(row.faqItems ?? []),
      sqlJson(row.related),
      sqlJson(row.keywords),
      row.ogImage ? sqlText(row.ogImage) : 'null',
      row.displayName ? sqlText(row.displayName) : 'null',
      row.icon ? sqlText(row.icon) : 'null',
      row.color ? sqlText(row.color) : 'null',
      row.showPrintableQuizCTA ? 'true' : 'false',
      String(row.sortOrder ?? 0),
      row.isActive ? 'true' : 'false',
    ].join(', ')} )`)
    .join(',\n');

  return `insert into public.trivia_categories (${columns.join(', ')})
values
${values}
on conflict (category_type, slug) do update set
  title = excluded.title,
  description = excluded.description,
  long_description = excluded.long_description,
  learning_points = excluded.learning_points,
  related = excluded.related,
  keywords = excluded.keywords,
  og_image = excluded.og_image,
  display_name = excluded.display_name,
  icon = excluded.icon,
  color = excluded.color,
  show_printable_quiz_cta = excluded.show_printable_quiz_cta,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();`;
}

function buildSubcategoryInsert(rows) {
  const columns = [
    'category_type',
    'category_slug',
    'subcategory',
    'slug',
    'question_count',
    'sort_order',
    'is_active',
  ];

  const values = rows
    .map((row) => `(${[
      sqlText(row.categoryType),
      sqlText(row.categorySlug),
      sqlText(row.subcategory),
      sqlText(row.slug),
      String(row.questionCount),
      String(row.sortOrder),
      row.isActive ? 'true' : 'false',
    ].join(', ')} )`)
    .join(',\n');

  return `insert into public.trivia_subcategories (${columns.join(', ')})
values
${values}
on conflict (category_type, category_slug, slug) do update set
  subcategory = excluded.subcategory,
  question_count = excluded.question_count,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();`;
}

const sql = `-- One-shot seed for trivia category metadata and subcategories.
-- Safe to rerun: the statements use upserts keyed by (category_type, slug).

begin;

${buildCategoryInsert([...dailyCategories, ...triviaCategoryRows])}

${buildSubcategoryInsert(triviaSubcategoryRows)}

commit;
`;

fs.writeFileSync(outputPath, sql);
console.log(`Wrote ${outputPath}`);

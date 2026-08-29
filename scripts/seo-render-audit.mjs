const DEFAULT_BASE_URL = 'http://localhost:3000';

const baseUrl = (process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');

const seedPaths = [
  '/',
  '/daily-trivias',
  '/daily-trivias/nature',
  '/daily-trivias/general-knowledge',
  '/brainwave',
  '/brainwave/plotle',
  '/brainwave/literale',
  '/challenges',
  '/trivias',
  '/word-games',
  '/number-puzzles',
  '/retro-games',
];

const prunedLinkTargets = [
  '/trivias',
  '/word-games',
  '/number-puzzles',
  '/retro-games',
];

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function getTagContent(html, tagName) {
  const match = html.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? decodeEntities(stripTags(match[1])) : '';
}

function getMetaContent(html, name) {
  const patterns = [
    new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${name}["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+property=["']${name}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${name}["'][^>]*>`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeEntities(match[1].trim());
  }

  return '';
}

function getCanonical(html) {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["'][^>]*>/i)
    || html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["'][^>]*>/i);
  return match ? decodeEntities(match[1].trim()) : '';
}

function getH1s(html) {
  return [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => decodeEntities(stripTags(match[1])));
}

function getLinks(html) {
  return [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)].map((match) => decodeEntities(match[1]));
}

function getJsonLdBlocks(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1].trim());
}

function getWordCount(html) {
  const text = stripTags(html);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function isIndexAllowed(robots) {
  return !robots.toLowerCase().split(',').map((item) => item.trim()).includes('noindex');
}

function expectedIndexability(path) {
  if (['/trivias', '/word-games', '/number-puzzles', '/retro-games'].includes(path)) {
    return false;
  }

  if (path.includes('?date=')) {
    return false;
  }

  return true;
}

async function fetchHtml(path) {
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;
  const response = await fetch(url, { redirect: 'manual' });
  const html = await response.text();

  return {
    url,
    path: new URL(url).pathname,
    status: response.status,
    html,
  };
}

async function discoverChallengePaths() {
  try {
    const { html } = await fetchHtml('/challenges');
    return [...new Set(getLinks(html)
      .filter((href) => /^\/challenges\/[^/?#]+$/.test(href))
      .slice(0, 3))];
  } catch {
    return [];
  }
}

function auditHtml({ url, path, status, html }) {
  const title = getTagContent(html, 'title');
  const description = getMetaContent(html, 'description');
  const robots = getMetaContent(html, 'robots');
  const canonical = getCanonical(html);
  const h1s = getH1s(html);
  const links = getLinks(html);
  const jsonLdBlocks = getJsonLdBlocks(html);
  const wordCount = getWordCount(html);
  const expectedIndex = expectedIndexability(path);
  const actualIndex = isIndexAllowed(robots);
  const jsonLdErrors = jsonLdBlocks
    .map((block) => {
      try {
        JSON.parse(block);
        return null;
      } catch (error) {
        return error.message;
      }
    })
    .filter(Boolean);
  const prominentPrunedLinks = links.filter((href) => prunedLinkTargets.includes(href));

  const issues = [];

  if (status !== 200) issues.push(`status=${status}`);
  if (!title) issues.push('missing title');
  if (title.length > 65) issues.push(`long title (${title.length})`);
  if (!description) issues.push('missing meta description');
  if (description && (description.length < 80 || description.length > 170)) {
    issues.push(`meta description length=${description.length}`);
  }
  if (!canonical && expectedIndex) issues.push('missing canonical');
  if (h1s.length !== 1) issues.push(`h1 count=${h1s.length}`);
  if (expectedIndex !== actualIndex) {
    issues.push(`robots mismatch expected ${expectedIndex ? 'index' : 'noindex'} got ${robots || 'index default'}`);
  }
  if (expectedIndex && wordCount < 250) issues.push(`thin rendered HTML (${wordCount} words)`);
  if (jsonLdErrors.length > 0) issues.push(`invalid JSON-LD (${jsonLdErrors.length})`);
  if (expectedIndex && jsonLdBlocks.length === 0) issues.push('no JSON-LD');
  if (['/', '/daily-trivias', '/brainwave', '/challenges'].includes(path) && prominentPrunedLinks.length > 0) {
    issues.push(`links to pruned pages: ${[...new Set(prominentPrunedLinks)].join(', ')}`);
  }

  return {
    path,
    status,
    title,
    descriptionLength: description.length,
    canonical,
    robots: robots || 'index default',
    h1s,
    wordCount,
    jsonLdCount: jsonLdBlocks.length,
    internalLinkCount: links.filter((href) => href.startsWith('/')).length,
    issues,
  };
}

function printResult(result) {
  const marker = result.issues.length > 0 ? 'WARN' : 'OK';
  console.log(`\n[${marker}] ${result.path}`);
  console.log(`  status: ${result.status}`);
  console.log(`  title: ${result.title || '(missing)'}`);
  console.log(`  description length: ${result.descriptionLength}`);
  console.log(`  canonical: ${result.canonical || '(missing)'}`);
  console.log(`  robots: ${result.robots}`);
  console.log(`  h1: ${result.h1s.join(' | ') || '(missing)'}`);
  console.log(`  words: ${result.wordCount}`);
  console.log(`  json-ld blocks: ${result.jsonLdCount}`);
  console.log(`  internal links: ${result.internalLinkCount}`);
  if (result.issues.length > 0) {
    console.log(`  issues: ${result.issues.join('; ')}`);
  }
}

async function main() {
  const challengePaths = await discoverChallengePaths();
  const paths = [...new Set([...seedPaths, ...challengePaths])];

  console.log(`SEO render audit against ${baseUrl}`);
  console.log(`Auditing ${paths.length} URLs`);

  const results = [];
  for (const path of paths) {
    try {
      results.push(auditHtml(await fetchHtml(path)));
    } catch (error) {
      results.push({
        path,
        status: 'fetch failed',
        title: '',
        descriptionLength: 0,
        canonical: '',
        robots: '',
        h1s: [],
        wordCount: 0,
        jsonLdCount: 0,
        internalLinkCount: 0,
        issues: [error.message],
      });
    }
  }

  results.forEach(printResult);

  const issueCount = results.reduce((sum, result) => sum + result.issues.length, 0);
  console.log(`\nSummary: ${results.length} URLs audited, ${issueCount} issue(s) flagged.`);

  if (issueCount > 0) {
    process.exitCode = 1;
  }
}

main();

import fs from 'node:fs';
import path from 'node:path';

const repoRoot = '/Users/biswaroopsom/src/triviaah';
const inputPath = path.join('/Users/biswaroopsom/Downloads', 'trivia-subcategories.csv');
const outputPath = path.join(repoRoot, 'supabase', 'trivia_subcategories_populate.sql');

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeSql(value) {
  return value.replace(/'/g, "''");
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.slice(1).map((line) => {
    const firstComma = line.indexOf(',');
    const lastComma = line.lastIndexOf(',');
    const category = line.slice(0, firstComma).trim();
    let subcategory = line.slice(firstComma + 1, lastComma).trim();
    const questionCount = Number(line.slice(lastComma + 1).trim());

    if (subcategory.startsWith('"') && subcategory.endsWith('"')) {
      subcategory = subcategory.slice(1, -1).replace(/""/g, '"');
    }

    return { category, subcategory, questionCount };
  });
}

const csv = fs.readFileSync(inputPath, 'utf8');
const rows = parseCsv(csv);
const grouped = new Map();

for (const row of rows) {
  if (!grouped.has(row.category)) {
    grouped.set(row.category, []);
  }
  grouped.get(row.category).push(row);
}

const orderedRows = [];

for (const [categorySlug, items] of grouped.entries()) {
  items.sort((a, b) => b.questionCount - a.questionCount || a.subcategory.localeCompare(b.subcategory));

  items.forEach((item, index) => {
    orderedRows.push({
      categoryType: 'trivias',
      categorySlug,
      subcategory: item.subcategory,
      slug: slugify(item.subcategory),
      questionCount: item.questionCount,
      sortOrder: index + 1,
    });
  });
}

const sql = [
  '-- One-shot population script for trivia_subcategories from the view export',
  '-- Safe to rerun: upserts are keyed by (category_type, category_slug, slug).',
  '',
  'begin;',
  '',
  'insert into public.trivia_subcategories (category_type, category_slug, subcategory, slug, description, question_count, sort_order, is_active)',
  'values',
  orderedRows
    .map(
      (row) =>
        `('${row.categoryType}', '${escapeSql(row.categorySlug)}', '${escapeSql(row.subcategory)}', '${escapeSql(row.slug)}', null, ${row.questionCount}, ${row.sortOrder}, true)`
    )
    .join(',\n'),
  'on conflict (category_type, category_slug, slug) do update set',
  '  subcategory = excluded.subcategory,',
  '  question_count = excluded.question_count,',
  '  sort_order = excluded.sort_order,',
  '  is_active = excluded.is_active,',
  '  updated_at = now();',
  '',
  'commit;',
  '',
].join('\n');

fs.writeFileSync(outputPath, sql);
console.log(`Wrote ${outputPath}`);

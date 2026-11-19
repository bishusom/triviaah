'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Search } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from './TriviaLibrary.module.css';
import { getSearchableItems, type SearchResult } from '@/lib/supabase';

interface TriviaCategory {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
  related?: string[];
  displayName?: string;
}

interface TriviaCategoriesExplorerProps {
  categories: Array<{
    key: string;
    category: TriviaCategory;
  }>;
}

function CategoryCard({
  categoryKey,
  category,
  index,
}: {
  categoryKey: string;
  category: TriviaCategory;
  index: number;
}) {
  return (
    <Link href={`/trivias/${categoryKey}`} className={styles.categoryCard}>
      <div className={`${styles.categoryArt} ${club[`tone${index % 4}`]}`}>
        {category.ogImage ? <Image src={category.ogImage} alt="" width={90} height={90} /> : <span>{category.title.charAt(0).toUpperCase()}</span>}
      </div>
      <div className={styles.cardBody}><h3>{category.displayName || category.title}</h3><p>{category.description}</p><span className={club.cardAction}>Explore category <ArrowRight size={17} /></span></div>
    </Link>
  );
}

export default function TriviaCategoriesExplorer({ categories }: TriviaCategoriesExplorerProps) {
  const [query, setQuery] = useState('');
  const [searchItems, setSearchItems] = useState<SearchResult[]>([]);

  useEffect(() => {
    getSearchableItems().then(setSearchItems);
  }, []);

  const filteredCategories = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return categories;

    return categories.filter(({ category, key }) => {
      const haystack = [
        key,
        category.title,
        category.displayName,
        category.description,
        ...(category.keywords || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(search);
    });
  }, [categories, query]);

  const matchingSubcategories = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (search.length < 2) return [];

    return searchItems
      .filter((item) => item.type === 'subcategory' && item.name.toLowerCase().includes(search))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [query, searchItems]);

  const resultsSummary = useMemo(() => {
    const formatCount = (count: number, singular: string, plural: string) =>
      `${count} ${count === 1 ? singular : plural} found`;

    if (!query.trim()) {
      return formatCount(filteredCategories.length, 'category', 'categories');
    }

    if (filteredCategories.length > 0 && matchingSubcategories.length > 0) {
      return `${filteredCategories.length} ${filteredCategories.length === 1 ? 'category' : 'categories'} and ${matchingSubcategories.length} ${matchingSubcategories.length === 1 ? 'subcategory' : 'subcategories'} found`;
    }

    if (filteredCategories.length > 0) {
      return formatCount(filteredCategories.length, 'category', 'categories');
    }

    if (matchingSubcategories.length > 0) {
      return formatCount(matchingSubcategories.length, 'subcategory', 'subcategories');
    }

    return 'No matches found';
  }, [filteredCategories.length, matchingSubcategories.length, query]);

  return (
    <>
      <div className={styles.searchPanel}>
        <label htmlFor="library-search">Search categories and topics</label>
        <div className={styles.searchInput}><Search size={19} aria-hidden="true" /><input id="library-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try history, movies, science…" /></div>
        <p aria-live="polite">{resultsSummary}</p>
      </div>
      <div className={styles.categoryGrid}>{filteredCategories.map(({ key, category }, index) => <CategoryCard key={key} categoryKey={key} category={category} index={index} />)}</div>
      {matchingSubcategories.length > 0 && <section className={styles.section}><div className={club.sectionHeading}><div><h2>Matching topics</h2><p>Go straight to a subject that sparks your interest.</p></div><span className={styles.muted}>{matchingSubcategories.length} results</span></div><div className={styles.topicGrid}>{matchingSubcategories.map(item => <Link key={`${item.type}-${item.slug}`} href={item.slug} className={styles.topicCard}><h3>{item.name}</h3><p>{item.parentCategory ? `${item.parentCategory} · ` : ''}{item.count} questions</p><span className={club.cardAction}>Explore topic <ArrowRight size={17} /></span></Link>)}</div></section>}
      {filteredCategories.length === 0 && matchingSubcategories.length === 0 && <div className={styles.empty}><h2>No matching categories or topics.</h2><p>Try another interest, such as science, sports, history, or movies.</p><button type="button" onClick={() => setQuery('')} className={club.primary}>Clear search</button></div>}
    </>
  );
}

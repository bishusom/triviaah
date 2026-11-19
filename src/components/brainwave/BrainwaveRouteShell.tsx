import type { ReactNode } from 'react';
import type { GamePageContent } from '@/lib/game-pages';
import { ArrowRight } from 'lucide-react';
import club from '@/components/home/PuzzleClub.module.css';
import styles from './BrainwaveClub.module.css';
import PuzzleClubFooter from '@/components/home/PuzzleClubFooter';
import Link from 'next/link';
import Image from 'next/image';
import BrainwaveWarmup from '@/components/brainwave/BrainwaveWarmup';
import { getBrainwaveWarmups } from '@/lib/brainwave/brainwave-warmup-data';

const SEO_CONTENT: Record<string, {
  howItWorks: string;
  clueTypes: string[];
  strategy: string;
  audience: string;
}> = {
  '/brainwave/plotle': {
    howItWorks:
      'Plotle turns a movie into a compact clue trail. The daily puzzle starts with a short plot signal, then uses feedback and unlockable hints to help you identify the film without giving away the cast too early.',
    clueTypes: ['Plot summary signals', 'Release-year context', 'Genre and award hints', 'Director, cast, and rating clues'],
    strategy:
      'Start with broad genre and era guesses before chasing exact titles. If a clue suggests a famous director or award season, use that context to narrow the answer instead of guessing only from memory.',
    audience:
      'Plotle is best for film fans, trivia players, and anyone who likes recognizing movies from story structure rather than posters or actors.',
  },
  '/brainwave/capitale': {
    howItWorks:
      'Capitale is a world-capitals deduction game. Each guess compares your capital city knowledge against the target and pushes you toward the correct answer through geography feedback.',
    clueTypes: ['Capital city names', 'Country and continent context', 'Distance and direction style feedback', 'Population and regional knowledge'],
    strategy:
      'Open with a capital you know well from a large region, then use the feedback to move across the map. Thinking by continent first usually saves attempts.',
    audience:
      'Capitale works well for geography students, travelers, map lovers, and quiz players who want a fast daily capitals challenge.',
  },
  '/brainwave/historidle': {
    howItWorks:
      'Historidle asks you to identify a historical figure or event from dates and progressive clues. The puzzle rewards timeline reasoning as much as raw memory.',
    clueTypes: ['Important dates', 'Era and region hints', 'Event or figure context', 'Progressive historical clues'],
    strategy:
      'Anchor the date range first, then separate political, scientific, cultural, and military possibilities. A wrong guess is still useful if it narrows the century or region.',
    audience:
      'Historidle is for history fans, students, teachers, and players who enjoy connecting clues across time.',
  },
  '/brainwave/celebrile': {
    howItWorks:
      'Celebrile is a celebrity guessing game built around identity clues. Each clue points to a public figure through career, achievements, field, nationality, or era.',
    clueTypes: ['Career clues', 'Achievement hints', 'Pop-culture context', 'Name feedback'],
    strategy:
      'Think by field first: actor, musician, athlete, creator, or public figure. Once the category is clear, use era and initials to avoid wasting guesses.',
    audience:
      'Celebrile is designed for pop-culture fans, entertainment trivia players, and anyone who follows famous people across film, music, sport, and media.',
  },
  '/brainwave/songle': {
    howItWorks:
      'Songle turns music recognition into a daily puzzle. Lyrics, artist clues, genre, and era details guide you toward the hidden song.',
    clueTypes: ['Lyric snippets', 'Artist information', 'Genre and decade clues', 'Album or chart context'],
    strategy:
      'Use genre and decade before guessing exact song titles. If the lyric clue feels familiar, confirm it against artist style rather than jumping to the first match.',
    audience:
      'Songle is for music fans, playlist obsessives, karaoke regulars, and trivia players who like testing memory across decades and genres.',
  },
  '/brainwave/literale': {
    howItWorks:
      'Literale is a book guessing puzzle where opening lines and literary clues lead to the title. It rewards recognition, reading memory, and deduction from author or genre context.',
    clueTypes: ['Opening lines', 'Author and genre clues', 'Publication-era hints', 'Title-letter feedback'],
    strategy:
      'Read the opening line for voice, setting, and period before guessing. Classic works often reveal themselves through style, while modern books may need genre and author clues.',
    audience:
      'Literale is for readers, literature students, book clubs, librarians, and anyone who likes literary trivia in a daily format.',
  },
  '/brainwave/creaturedle': {
    howItWorks:
      'Creaturedle asks you to identify an animal from structured biology clues. Habitat, diet, class, size, activity, and body covering all contribute to the solution.',
    clueTypes: ['Animal class', 'Habitat and diet', 'Size and activity', 'Body covering and wildlife facts'],
    strategy:
      'Start with broad animal families, then narrow by habitat and diet. A clue like nocturnal, aquatic, herbivore, or feathered quickly removes many options.',
    audience:
      'Creaturedle is useful for nature lovers, biology learners, wildlife fans, and families who want an educational animal puzzle.',
  },
  '/brainwave/foodle': {
    howItWorks:
      'Foodle identifies a dish through cuisine, ingredients, cooking method, course, flavor profile, and serving temperature. It is food trivia with a deduction engine.',
    clueTypes: ['Cuisine and course', 'Main ingredients', 'Cooking method', 'Flavor and temperature clues'],
    strategy:
      'Cuisine is usually the strongest early signal. Pair it with cooking method and ingredients to decide whether you are looking for a street food, dessert, stew, drink, or main dish.',
    audience:
      'Foodle is for food lovers, home cooks, travelers, and quiz players who enjoy learning how dishes connect to culture and geography.',
  },
  '/brainwave/landmarkdle': {
    howItWorks:
      'Landmarkdle turns famous places into a clue-based architecture and travel puzzle. You solve the landmark using type, location, builder, year, height, and material hints.',
    clueTypes: ['Landmark type', 'Location clues', 'Architect or builder hints', 'Year, height, and material details'],
    strategy:
      'Identify the region first, then match the structure type. A tower, temple, bridge, monument, or palace usually points to a much smaller answer set.',
    audience:
      'Landmarkdle is made for travelers, architecture fans, geography students, and players who like recognizing iconic places.',
  },
  '/brainwave/inventionle': {
    howItWorks:
      'Inventionle asks you to identify an invention from historical and technical clues. Inventor, year, category, country, purpose, and impact all help reveal the answer.',
    clueTypes: ['Inventor information', 'Year and country', 'Purpose and category', 'Impact and technology clues'],
    strategy:
      'Use the era to separate ancient tools from industrial or modern technology. Then match purpose and impact to the invention that changed that field.',
    audience:
      'Inventionle is for science fans, history learners, engineers, makers, and trivia players who enjoy how ideas become tools.',
  },
  '/brainwave/synonymle': {
    howItWorks:
      'Synonymle is a semantic word puzzle. Instead of matching letters first, you move closer to the answer by guessing words with related meanings.',
    clueTypes: ['Semantic similarity', 'Synonym relationships', 'Vocabulary distance', 'Meaning-based feedback'],
    strategy:
      'Begin with common words in different meaning families, then follow the strongest similarity score. Avoid tiny spelling changes unless the meaning also moves closer.',
    audience:
      'Synonymle is for word-game players, vocabulary builders, writers, and anyone who likes language puzzles beyond spelling.',
  },
  '/brainwave/automoble': {
    howItWorks:
      'Automobile is a vehicle guessing game built from progressive automotive clues. The puzzle may point to manufacturer, era, body style, performance, country, or notable model facts.',
    clueTypes: ['Manufacturer and country', 'Model era', 'Body style and category', 'Performance or design clues'],
    strategy:
      'Separate everyday vehicles from sports cars, classics, trucks, and luxury models first. Manufacturer and decade usually narrow the answer quickly.',
    audience:
      'Automobile is for car enthusiasts, engineering students, automotive trivia fans, and players who like identifying machines from details.',
  },
  '/brainwave/botanle': {
    howItWorks:
      'Botanle is a plant identification puzzle. Botanical clues describe a plant through appearance, habitat, use, family, region, and common traits.',
    clueTypes: ['Plant type and family', 'Habitat clues', 'Appearance and use', 'Region or botanical facts'],
    strategy:
      'Treat each clue like a field note. Decide whether you are solving a flower, tree, herb, crop, shrub, or ornamental plant before guessing the name.',
    audience:
      'Botanle is for gardeners, botany students, nature lovers, and players who want plant knowledge in a quick daily game.',
  },
  '/brainwave/citadle': {
    howItWorks:
      'Citadle focuses on world cities rather than countries or capitals. Landmarks, skylines, urban geography, and regional hints help identify the city.',
    clueTypes: ['City geography', 'Landmarks and skyline clues', 'Regional context', 'Urban identity hints'],
    strategy:
      'Start by identifying the continent or region, then think about cities known for the visible landmark, skyline, river, architecture, or cultural clue.',
    audience:
      'Citadle is for travelers, geography fans, city lovers, and players who enjoy urban clues more than country-level trivia.',
  },
  '/brainwave/countridle': {
    howItWorks:
      'Countridle is a country guessing puzzle using flags, maps, outlines, and geographic hints. Each attempt helps you move closer to the target country.',
    clueTypes: ['Flag image reveals', 'Country outline or map hints', 'Continent and neighbor clues', 'Population, language, and currency context'],
    strategy:
      'Use continent and map shape before guessing from flag color alone. Neighboring countries, languages, and currencies can confirm the final answer.',
    audience:
      'Countridle is for geography learners, flag fans, map readers, and quiz players who want a daily country challenge.',
  },
  '/brainwave/trordle': {
    howItWorks:
      'Trordle combines trivia questions with limited attempts. Instead of solving a single category, you use general knowledge and feedback to guess the answer.',
    clueTypes: ['Daily trivia question', 'General-knowledge context', 'Attempt-based feedback', 'Category hints'],
    strategy:
      'Read the wording carefully and identify the likely category before guessing. Broad knowledge helps, but eliminating wrong answer types is just as important.',
    audience:
      'Trordle is for daily trivia players, quiz fans, and anyone who wants a Wordle-style challenge with general knowledge.',
  },
};

const PUZZLE_NOTES: Record<string, { title: string; body: string; links: Array<{ href: string; label: string }> }> = {
  '/brainwave/botanle': {
    title: "Today's Plant Lens",
    body:
      'Botanle is strongest when you treat every clue as a field note, not a flashcard. Habitat tells you where the plant survives, common use hints at why people remember it, and appearance clues help separate similar flowers, trees, herbs, and crops. That mix gives the page more than a single answer: each daily puzzle becomes a small botany lesson.',
    links: [
      { href: '/brainwave/creaturedle', label: 'Compare it with Creaturedle' },
      { href: '/brainwave/foodle', label: 'Follow plant clues into Foodle' },
      { href: '/daily-trivias/science', label: 'Play Science daily trivia' },
    ],
  },
  '/brainwave/foodle': {
    title: 'Why Foodle is really a geography puzzle',
    body:
      'Ingredients are only half the signal. A cooking method, spice pattern, or serving tradition often points to a region before it points to a dish. That is why Foodle pairs well with geography and culture games.',
    links: [
      { href: '/brainwave/countridle', label: 'Try Countridle next' },
      { href: '/daily-trivias/geography', label: 'Play Geography daily trivia' },
    ],
  },
  '/brainwave/plotle': {
  title: "How Plotle Differs From Other Movie Guessing Games",
  body:
    'Most movie games give you cast or genre upfront. Plotle makes you earn every clue: release year unlocks first, then genre and Oscar history, then director and cast, then IMDb rating and first letter. That escalating reveal forces you to think cinematically rather than just recognise names. Films with unusual titles or unexpected directors tend to trip people up the most.',
  links: [
    { href: '/brainwave/historidle', label: 'Try Historidle next' },
    { href: '/brainwave/celebrile', label: 'Guess the celebrity in Celebrile' },
    { href: '/daily-trivias/movies', label: 'Play Movies daily trivia' },
  ],
}
};

export default function BrainwaveRouteShell({
  page,
  showIntro = true,
  relatedGames = [],
  children,
}: {
  page: GamePageContent;
  showIntro?: boolean;
  relatedGames?: GamePageContent[];
  children: ReactNode;
}) {
  // Filter out the current page and any hub pages
  const otherGames = relatedGames
    .filter(g => g.route_path !== page.route_path && g.page_kind !== 'hub')
    .slice(0, 12); // Allowing up to 12 for the full collection
  const seoContent = SEO_CONTENT[page.route_path];
  const slug = page.route_path.replace('/brainwave/', '');
  const warmupPuzzles = getBrainwaveWarmups(slug);
  const gameName = page.title.split(' - ')[0];

  return (
    <div className={styles.page}>
      <main id="brainwave-main" className={styles.puzzleMain}>
        <header className={styles.puzzleHeader}><p className={club.eyebrow}>{page.featured ? 'FEATURED · ' : ''}{page.is_daily_refresh ? 'A FRESH PUZZLE EVERY DAY' : 'PLAY AT YOUR OWN PACE'}</p><h1>{page.title}</h1>{showIntro && <p className={styles.intro}>{page.intro_text}</p>}</header>
        {children}
        {warmupPuzzles.length > 0 && <BrainwaveWarmup puzzles={warmupPuzzles} gameTitle={gameName} light />}
        {seoContent && <section className={styles.guide}><p className={club.eyebrow}>GAME GUIDE</p><h2>How {gameName} works</h2><p>{seoContent.howItWorks}</p><div className={styles.guideColumns}><article><h3>Clue types</h3><ul>{seoContent.clueTypes.map(clue => <li key={clue}>{clue}</li>)}</ul></article><article><h3>Solving strategy</h3><p>{seoContent.strategy}</p></article></div><h3>Who this puzzle is for</h3><p>{seoContent.audience}</p></section>}
        {PUZZLE_NOTES[page.route_path] && <section className={styles.note}><p className={club.eyebrow}>A CLOSER LOOK</p><h2>{PUZZLE_NOTES[page.route_path].title}</h2><p>{PUZZLE_NOTES[page.route_path].body}</p><div className={styles.links}>{PUZZLE_NOTES[page.route_path].links.map(link => <Link key={link.href} href={link.href} className={club.textLink}>{link.label}<ArrowRight size={15} /></Link>)}</div></section>}
        {page.highlights.length > 0 && <div className={styles.highlights}>{page.highlights.map(highlight => <span key={highlight}>{highlight}</span>)}</div>}
        {page.faq_items.length > 0 && <section className={styles.faq}><h2>Frequently asked questions</h2>{page.faq_items.map((faq, index) => <details key={index}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>}
        {otherGames.length > 0 && <section className={styles.section}><p className={club.eyebrow}>YOUR NEXT AHA! MOMENT</p><h2>More Brainwave games</h2><div className={styles.related}>{otherGames.map(game => <Link key={game.route_path} href={game.route_path}>{game.og_image && <Image src={game.og_image} alt="" width={60} height={60} />}<span>{game.title}</span><ArrowRight size={16} /></Link>)}</div></section>}
      </main>
      <PuzzleClubFooter />
    </div>
  );
}

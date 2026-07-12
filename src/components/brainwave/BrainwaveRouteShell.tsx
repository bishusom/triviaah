import type { ReactNode } from 'react';
import type { GamePageContent } from '@/lib/game-pages';
import { CalendarDays, Sparkles, HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-4 md:py-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 shadow-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {page.featured ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                <Sparkles className="h-3.5 w-3.5" />
                Featured
              </span>
            ) : null}
            {page.is_daily_refresh ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                <CalendarDays className="h-3.5 w-3.5" />
                Daily Refresh
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                Evergreen
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
            {page.title}
          </h1>
          {showIntro ? (
            <p className="mt-2 max-w-3xl text-sm md:text-base text-white/75">
              {page.intro_text}
            </p>
          ) : null}
        </div>

        <div className="mt-6">
          {children}
        </div>

        {seoContent ? (
          <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-4 md:p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
              Game Guide
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              How {page.title.split(' - ')[0]} Works
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              {seoContent.howItWorks}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-base font-semibold text-cyan-200">Clue Types</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                  {seoContent.clueTypes.map((clue) => (
                    <li key={clue} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                      <span>{clue}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <h3 className="text-base font-semibold text-cyan-200">Solving Strategy</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  {seoContent.strategy}
                </p>
              </article>
            </div>

            <article className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <h3 className="text-base font-semibold text-cyan-200">Who This Puzzle Is For</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {seoContent.audience}
              </p>
            </article>
          </section>
        ) : null}

        {PUZZLE_NOTES[page.route_path] ? (
          <section className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 md:p-6 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">
              Developer's Note
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              {PUZZLE_NOTES[page.route_path].title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-cyan-50/80">
              {PUZZLE_NOTES[page.route_path].body}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {PUZZLE_NOTES[page.route_path].links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-cyan-300/20 bg-black/20 px-3 py-2 text-xs font-semibold text-cyan-100 transition-colors hover:border-cyan-200/50 hover:bg-cyan-300/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {page.highlights.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {page.highlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100"
              >
                {highlight}
              </span>
            ))}
          </div>
        ) : null}

        {page.faq_items.length ? (
          <details className="group mt-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 md:p-6 shadow-2xl">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <HelpCircle className="h-5 w-5 text-cyan-300" />
                Frequently Asked Questions
              </h2>
              <ChevronDown className="h-5 w-5 text-cyan-300 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {page.faq_items.map((faq, index) => (
                <article key={`${faq.question}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <h3 className="text-base font-semibold text-cyan-200">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/70">{faq.answer}</p>
                </article>
              ))}
            </div>
          </details>
        ) : null}

        {/* Subtle More Brainwave Section */}
        {otherGames.length > 0 && (
          <section className="mt-12 pt-8 border-t border-white/5">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-cyan-500/80 mb-6 font-black">
              More Brainwave Games
            </h2>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              {otherGames.map((game) => (
                <Link
                  key={game.route_path}
                  href={game.route_path}
                  className="group block w-20 sm:w-24"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-cyan-500/40 group-hover:bg-white/10 group-hover:scale-105">
                    {game.og_image && (
                      <Image
                        src={game.og_image}
                        alt={game.title}
                        fill
                        className="object-contain p-2.5 opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                        sizes="(max-width: 768px) 80px, 96px"
                      />
                    )}
                  </div>
                  <h3 className="mt-2 text-[10px] font-medium text-white/40 group-hover:text-cyan-300 transition-colors line-clamp-1 text-center">
                    {game.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

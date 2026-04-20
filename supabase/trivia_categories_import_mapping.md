# Trivia Category Import Mapping

## Source CSV: `trivia-cateogory.csv`

Columns:
- `categoty-type` -> `trivia_categories.category_type`
- `category` -> `trivia_categories.slug`
- `Name` -> `trivia_categories.title`

Derived values:
- `display_name` -> `Name`
- `icon` -> seed from the current category config or a manual map
- `description` -> seed from existing copy in the app or editorial text
- `long_description` -> seed from existing copy in the app or editorial text
- `faq_items` -> JSON array of FAQ objects for daily trivia landing pages
- `learning_points` -> JSON array from existing copy in the app or editorial text
- `related` -> JSON array from existing copy in the app or editorial text
- `keywords` -> JSON array from existing copy in the app or editorial text
- `og_image` -> `/imgs/categories/${slug}.webp` or the existing image path
- `color` -> seed from existing design palette
- `show_printable_quiz_cta` -> default `true`

Important cleanup before import:
- `geogpraphy` -> `geography`
- `Sciene & Nature` -> `Science & Nature`
- `categoty-type` header -> `category_type`

## Source CSV: `trivia-subcategories.csv`

Columns:
- `category_type` -> derived as `trivias` for all imported rows
- `category` -> `trivia_subcategories.category_slug`
- `subcategory` -> `trivia_subcategories.subcategory`
- `question_count` -> `trivia_subcategories.question_count`

Derived values:
- `slug` -> `slugifyTriviaSegment(subcategory)`
- `sort_order` -> optional manual ordering, else `0`
- `is_active` -> default `true`

## Recommended import order

1. Insert all rows into `trivia_categories`.
2. Insert all rows into `trivia_subcategories`.
3. Backfill any missing `related` arrays and editorial copy.
4. Run the app build or refresh the Supabase schema cache.

## Identity model

- `trivia_categories` is keyed by `(category_type, slug)` so `daily-trivias/science` and `trivias/science` can coexist.
- `trivia_subcategories` is keyed by `(category_type, category_slug, slug)` and all current rows use `category_type = trivias`.

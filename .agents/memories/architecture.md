# Architecture

Eleventy 2.x site. Input: `src/`, output: `dist/`. Package manager: pnpm (v11, declared in `packageManager` field).

## Layouts

Two layouts in `src/_includes/`, chained via Eleventy's layout cascade:

- `base.njk` — outer shell: `<head>`, conditional `<header>` + nav, `<main>{{ content | safe }}</main>`, conditional `<footer>` (suppressed on `/` since the home page already contains contact links inline)
- `post.njk` — sets `layout: base.njk` in its own front matter; wraps content in `<article>` with `<time>` and a `← Writing` back link

Pages use `layout: base.njk` directly. Posts use `layout: post.njk`, which chains into base.

## Data layer (`src/_data/`)

- `site.js` — env-driven config; exposes `site.showNav` (reads `SHOW_NAV`, defaults `false`). Add further env-backed flags here.
- `nav.json` — `[{ label, url }]` array iterated in `base.njk` to render the nav. Add new top-level sections here. Current-page state is derived by comparing each item's `url` to `page.url` and setting `aria-current="page"` on the matching `<a>`.

## Writing collection (`src/writing/`)

- `writing.json` — directory data file; applies `layout: post.njk` to all files in the directory
- Collection defined in `eleventy.config.js` via `getFilteredByGlob("src/writing/*.md")` — glob-based (not tags) so `index.njk` is never self-included
- `index.njk` overrides `layout: base.njk` in its own front matter to escape the directory data file's layout

## `eleventy.config.js`

- Passthrough copies: `style.css`, `favicon.svg`, `snow.js`, `snow-worker.js`, `season.js`
- Date filters: `htmlDateString` (→ `YYYY-MM-DD`) and `readableDate` (→ `d MMMM YYYY`, en-GB)
- `writing` collection sorted newest-first

## Styling (`src/style.css`)

- `color-scheme: light dark` with `light-dark()` for all color tokens — no `@media (prefers-color-scheme)` blocks
- `65rch` column width (root-relative so it stays consistent across elements with different `font-size`)
- Near-classless; only `.snow-toggle` and `.button` are named classes

## Snow animation

`snow.js`, `snow-worker.js`, `season.js` are self-contained client-side modules, passthrough-copied as-is. Animation runs in a Web Worker on an offscreen canvas, activates only in winter, persists preference to `localStorage`. Referenced only from `src/index.njk`.

## CI / Deployment

PR previews: `.github/workflows/preview.yml` deploys to `https://pr-<N>-chudesnov.surge.sh` via Surge.sh on every push, tears down on close. Requires a GitHub environment named `CI` with a `SURGE_TOKEN` secret. Preview URL is surfaced in the PR via `environment.url` and available in steps as `$PREVIEW_URL`.

Main branch deployment is on statichost.eu and is not configured in this repo.

## Module system

`eleventy.config.js` and `src/_data/*.js` are currently CommonJS (`module.exports`). See `.agents/tasks/esm-migration.md` for the planned migration.

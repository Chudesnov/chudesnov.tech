# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm build          # build to dist/
pnpm start          # dev server on :3000 with incremental rebuilds
```

No linter or test suite is configured.

## Architecture

Eleventy 2.x site. Input: `src/`, output: `dist/`.

### Layouts (src/_includes/)

Two layouts, chained:

- `base.njk` — outer shell: `<head>`, conditional `<header>`+nav, `<main>{{ content | safe }}</main>`, conditional `<footer>` (suppressed on `/`)
- `post.njk` — sets `layout: base.njk` in its own front matter; wraps content in `<article>` with `<time>` and a back link

Pages use `layout: base.njk` directly; posts use `layout: post.njk` which chains into base.

### Data (src/_data/)

- `site.js` — computed data; currently exposes `site.showNav` (reads `SHOW_NAV` env var, defaults false). Use this file for any env-driven config.
- `nav.json` — array of `{ label, url }` objects that `base.njk` loops over to render the nav. Add new top-level sections here.

### Writing collection (src/writing/)

- `writing.json` — directory data file; sets `layout: post.njk` on all files in the directory
- Posts are `.md` files; the `writing` collection is defined in `eleventy.config.js` via `getFilteredByGlob("src/writing/*.md")` (not tags) so `index.njk` is never self-included
- `index.njk` overrides `layout: base.njk` in its own front matter to escape the directory data file

### eleventy.config.js

Registers two date filters used in templates:
- `htmlDateString` → `YYYY-MM-DD` (for `datetime` attributes)
- `readableDate` → `d MMMM YYYY` en-GB locale

All static assets (JS, CSS, SVG) are passthrough-copied; Eleventy does not process them.

### Snow animation

`snow.js`, `snow-worker.js`, `season.js` are self-contained client-side modules copied as-is to `dist/`. The animation runs in a Web Worker on an offscreen canvas, activates only in winter, and persists preference to `localStorage`. Referenced only from `src/index.njk`.

### Styling

Single stylesheet: `src/style.css`. Uses `color-scheme: light dark` with `light-dark()` CSS function for all color tokens — no `@media (prefers-color-scheme)` blocks needed. Column width is `65rch` (root-relative, so it stays consistent across elements with different font sizes).

Nav current-page state is conveyed via `aria-current="page"` on the `<a>` element, styled via `nav [aria-current="page"]`.

Footer is suppressed on `/` (home page already contains contact links inline).

## CI / Deployment

PR previews deploy to `https://pr-<N>-chudesnov.surge.sh` via `.github/workflows/preview.yml`. Requires:
- A GitHub environment named `CI` with a `SURGE_TOKEN` secret
- The preview URL appears in the PR via `environment.url`; the same URL is available in steps as `$PREVIEW_URL`

Main branch deployment is handled separately (statichost.eu) and is not configured in this repo.

## Pending work

- **ESM migration**: `eleventy.config.js` and `src/_data/site.js` are CommonJS (`module.exports`). Migrating to ESM requires adding `"type": "module"` to `package.json` and converting both files to `export default` — coordinate as a single PR since the change affects all `.js` config/data files at once.

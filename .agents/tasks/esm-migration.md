---
id: esm-migration
name: Migrate to ESM
status: done
---

## Goal

Convert the project from CommonJS to ES Modules so all `.js` files use `import`/`export` consistently.

## Scope

Three files must change together in one PR:

1. `package.json` — add `"type": "module"`
2. `eleventy.config.js` — `module.exports = function(...)` → `export default function(...)`
3. `src/_data/site.js` — `module.exports = {...}` → `export default {...}`

Any future `_data/*.js` files should be authored as ESM from the start once this lands.

## Notes

- Eleventy 2.x supports ESM when `"type": "module"` is present in `package.json`
- The change is coordinated — adding `"type": "module"` alone will break the config file before it is converted

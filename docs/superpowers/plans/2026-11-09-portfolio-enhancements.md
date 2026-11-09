# Portfolio Enhancements Implementation Plan

## Task 1: Shared project evidence model

- Extend project metadata with audience tags, measured evidence state, benchmark method, architecture nodes, source paths, decisions, privacy disclosures, and phase labels.
- Add reusable architecture, evidence, decision, privacy, code-map, contact, and related-project sections to case studies.
- Generate individual project sharing cards and precise page metadata.
- Add accurate source, demo, and release links.

## Task 2: Interactive project exploration

- Add CPU explode/reset and part selection with visible DOM controls and keyboard support.
- Map selected compute tiles to projects without removing the existing whole-CPU open/close interaction.
- Build four labeled, local-only sample demos and guided tours.
- Add project comparison, role routes, skill evidence links, and factual build-phase timelines.

## Task 3: Offline/accessibility and English-only interface

- Keep all site content in English and omit language and direction controls, per the user’s direction.
- Add a static web manifest and a constrained same-origin service worker; exclude analytics, forms, and query-driven content from caching.
- Review focus order, captions, keyboard behavior, responsive layouts, reduced motion, and WebGL fallback.
- Add accurate role-focused résumé filters without adding unverified biography.

## Task 4: Verification and delivery

- Run typecheck and production static build.
- Run existing `tests/portfolio.mjs`, `tests/processor.mjs`, and `tests/visual.mjs` against a local production preview.
- Manually inspect the English-only interface, light/dark, processor interactions, demos, comparison, offline response, project metadata, and contact links.
- Commit and push to `main`, then confirm the GitHub Pages workflow and inspect the deployed site.

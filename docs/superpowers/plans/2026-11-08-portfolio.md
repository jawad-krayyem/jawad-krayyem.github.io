# Portfolio Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement the twenty approved portfolio enhancements, excluding the withdrawn app/game showcase.

**Architecture:** Static project and note data feed server-rendered pages and case studies. Small client components provide filters, mobile navigation, the loading screen, clipboard feedback and command navigation. Local assets support previews, videos, résumé and social sharing.

**Tech Stack:** Existing Next.js/React/TypeScript/CSS; browser verification with the available Playwright runtime.

**Spec:** `docs/superpowers/specs/2026-11-08-portfolio-design.md`

## Global Constraints

- Keep static export and GitHub Pages workflow working.
- Preserve the exact supplied privacy-policy text and consent behavior.
- Use verified facts; no invented biography, live inference, release links or product results.
- Work in the existing checkout; leave changes uncommitted for the established user workflow.
- Use existing dependencies and accessible native browser controls where possible.

## Review Focus

- Blocked storage or delayed JavaScript must never leave an inaccessible loading overlay.
- Menu/dialog cancellation restores focus, including after client-side navigation.
- Deep links and preview media resolve from a plain static server, including encoded Next.js export paths.
- Clipboard rejection provides a usable manual alternative without a success claim.
- Mobile text scaling and dark theme maintain readable, operable controls.

### Task 1: Content and static routes

**Files:** `app/lib/projects.ts`, `app/lib/notes.ts`, `app/projects/[slug]/page.tsx`, `app/notes/page.tsx`, `app/notes/[slug]/page.tsx`, `app/resume/page.tsx`.

**Interfaces:** `projects: Project[]`, `notes: Note[]`; route parameters use `generateStaticParams` and awaited params.

- [x] Write and run browser/content checks against the existing site to establish expected missing behavior.
- [x] Review repository/local source material and define factual project and note content.
- [x] Build statically exported detail, notes and résumé pages with metadata.

### Task 2: Shared experience and home page

**Files:** `app/components/SiteChrome.tsx`, `CommandPalette.tsx`, `SiteLoader.tsx`, `ProjectGrid.tsx`, `ContactActions.tsx`, `Icons.tsx`, `app/page.tsx`, `app/globals.css`, `app/layout.tsx`.

**Interfaces:** ProjectGrid consumes Project[]; command navigation uses the same data; footer preserves PrivacySettingsButton.

- [x] Implement accessible native-dialog navigation and mobile menu after the corresponding failing behavior tests.
- [x] Implement category filtering, clipboard feedback, honest loading feedback and persistent theme.
- [x] Apply the approved visual direction to home, project, notes, privacy and terminal pages.

### Task 3: Media, résumé and discoverability

**Files:** `public/images/projects/*`, `public/demos/*`, `public/resume/*`, `public/og-image.png`, `app/sitemap.ts`, `scripts/*`.

- [x] Capture authentic project interfaces where available using synthetic preview data, with explicit labels.
- [x] Provide user-controlled preview videos/captions and their posters.
- [x] Generate a truthful project-based résumé PDF and inspect its rendered page.
- [x] Generate a local sharing image and verify metadata and exported links.

### Task 4: Verification and review

**Files:** `tests/portfolio.mjs`, `scripts/verify-export.mjs`, `README.md`.

- [x] Run typecheck and production build.
- [x] Run browser behavior, responsive, reduced-motion and consent checks.
- [x] Inspect screenshots, previews and PDF; fix functional failures.
- [x] Obtain one independent whole-change review and address material findings.
- [x] Document how to maintain project content and media, and provide publishing commands.

### Authorized scope extension: processor and cursor

- [x] Add `ProcessorExplorer`, lazy `processor-scene`, `CustomCursor`, and `processor.css`.
- [x] Apply graphite/mint default dark theme while respecting saved light mode.
- [x] Improve physical materials and chip geometry following the user’s realism request.
- [x] Verify real WebGL, reveal/close behavior, cursor modes, opt-out across navigation, reduced motion and WebGL failure.
- [x] Independently review the new delta; fix cursor-state synchronization and verify its regression.

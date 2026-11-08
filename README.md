# Jawad Krayyem's portfolio

The graphite/mint portfolio includes an interactive Three.js processor, a custom
cursor, four reviewed projects, category filters, static project
case studies, three technical notes, a project-based résumé, keyboard navigation,
responsive mobile navigation, light/dark themes, and a fail-open branded loader.
The app/game showcase was omitted at the user's request.

## Maintaining the portfolio

- The processor opens with a click, Enter or Space and reveals the project links.
  `app/components/ProcessorExplorer.tsx` owns the accessible interface;
  `app/lib/processor-scene.ts` owns the lazy-loaded Three.js scene.
  Geometry, materials, lighting and labels are procedural. No external 3D model
  or HDR download is needed. It renders on demand, stops offscreen, caps pixel
  ratio, honors reduced motion and disposes its GPU resources on unmount.
- `app/processor.css` defines the graphite/mint presentation and cursor states.
  New visitors start in dark mode; a saved light choice is respected.
- Cursor effects respond to loading, links, the chip, and scrolling. They never
  intercept pointer events or wheel scrolling. Touch, reduced motion, form fields,
  and native dialogs retain the system cursor. The footer offers an opt-out,
  stored locally as `jk-cursor`; theme preference uses `jk-theme`.

- Edit project facts, categories, technologies and links in `app/lib/projects.ts`.
- Edit technical notes in `app/lib/notes.ts`; detail routes export automatically.
- Screenshots are in `public/images/projects/`. The three application screenshots
  show the actual public frontend code with synthetic preview data. The Datheon
  preview is an architecture diagram, not a product screenshot.
- Two silent, captioned interface recordings are in `public/demos/`. They show
  interface behavior with sample data, not live model inference. Keep that
  distinction when replacing them. Video playback is user-controlled.
- The résumé describes verified project work, without invented employment or
  education. Update `app/resume/page.tsx` before adding personal history.
  Its downloadable PDF is `public/resume/jawad-krayyem-resume.pdf`.
- `public/og-image.png` is the social sharing image. Each content route has a
  canonical URL; `app/sitemap.ts` includes every public content route.
- Ctrl+K or Command+K opens quick navigation. Escape closes it and returns focus.
- Contact is a mail link plus a clipboard button; no server or form service is needed.

## Validation

Run `pnpm typecheck`, `pnpm build`, then `node scripts/verify-export.mjs`.
Browser checks use Playwright and a local Chrome installation. If Playwright is
available in your development environment, start `pnpm preview --listen 4180`
and run:

```sh
node tests/portfolio.mjs http://127.0.0.1:4180
node tests/visual.mjs http://127.0.0.1:4180
node tests/processor.mjs http://127.0.0.1:4180
```

The scripts also accept a third argument pointing at an existing Playwright
`package.json`, so a bundled runtime can run the checks without changing project
dependencies. Set `CHROME_PATH` when Chrome is installed outside its default
Windows location. Checks cover filters, menu/dialog keyboard behavior, clipboard
failure, themes, responsive images, video playback, and static deep links.

To regenerate the résumé from a production preview, run
`node scripts/export-resume.mjs http://127.0.0.1:4180` (the same optional
Playwright argument is supported), inspect the PDF, then rebuild. The exported
PDF is forced to light mode and contains no live analytics calls.

A Next.js site exported to static HTML for <https://jawad-krayyem.github.io/>.
The repository must be named `jawad-krayyem.github.io` under the `jawad-krayyem` account.

## Local development

Install Node.js 22.18 or Node.js 24, and pnpm 10.14.0.
Run these commands from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

To check and preview the production site:

```sh
pnpm typecheck
pnpm build
pnpm preview
```

Open the address printed by the preview command. The `out/` directory contains
the complete static site, including the home page, `/terminal/`,
`/privacy-policy/`, and a `404.html` page. It is generated locally and in CI,
and is ignored by Git.

## Deploy to GitHub Pages

1. For free hosting with GitHub Free, make the repository public.
2. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Commit these changes and push them to `main`.
4. Open **Actions → Deploy Next.js to GitHub Pages** and wait for both jobs to succeed.
5. Visit <https://jawad-krayyem.github.io/>.

Each later push to `main` rebuilds and deploys the site. You can also start
the workflow manually from the Actions tab.

The single deployment workflow installs the pinned dependencies, checks
TypeScript, builds the site, and uploads `out/`. No separate server or database
is needed. Static export, trailing slashes, and unoptimized images are configured
in `next.config.ts`. `public/.nojekyll` is copied into the export.
This is a user site at the domain root, so it does not need a repository base path.

The active source is in `app/`, the privacy policy is in `content/`, and images
and other public files are in `public/`. The unused Replit workspace, backend,
database, generated API clients, mockup app, older Vite app, duplicate deployment
workflow, and committed build output have been removed.

References: [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
and [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).

## Analytics consent

The custom consent banner uses basic Google Consent Mode v2. The Google Analytics
script is loaded only after Accept analytics is chosen or a valid accepted choice
is restored. Reject analytics keeps collection disabled. Advertising storage,
advertising user data, and ad personalization stay denied even when analytics is accepted.

Choices are remembered for 180 days in browser local storage. Privacy settings in
the footer reopens the banner. Changes are synchronized between tabs. Rejecting
after accepting disables measurement and clears accessible analytics cookies.
The privacy policy page includes a notice about this website's analytics.

After deploying this change, choose **I use a custom consent banner** in Google's
consent setup. In Tag Assistant, verify that no analytics loader runs before consent,
Accept analytics grants only analytics storage, and Reject analytics denies it.
Use a fresh browser session to test the initial state.

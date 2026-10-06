# Jawad Krayyem's portfolio

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

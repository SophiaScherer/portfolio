# Portfolio

Personal portfolio site for Sophia Scherer, built with Next.js (App Router), React, and Sass. Project images and the resume are served from Hygraph.

## Setup

Requires Node 22 (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

| Variable | Purpose |
|---|---|
| `HYGRAPH_ENDPOINT`, `HYGRAPH_TOKEN` | Hygraph content API (resume, project images, galleries) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Outgoing mail for the contact form |
| `CONTACT_TO` | Inbox that receives contact messages (defaults to `SMTP_USER`) |

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | Generates route types, then runs `tsc` |
| `npm run lint` | ESLint, failing on warnings |
| `npm run format` / `npm run format:check` | Prettier for the TypeScript, JavaScript, JSON, and YAML (SCSS and Markdown keep their hand alignment) |
| `npm run knip` | Unused files, dependencies, and exports |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end and accessibility tests (Playwright, against a production build; run `npx playwright install chromium` once) |
| `npm run icons` | Regenerates the self-hosted icon font from the list in `scripts/fetch-icons.mjs` |
| `npm run fonts` | Re-downloads the self-hosted text fonts listed in `scripts/fetch-fonts.mjs` |

## Content

Project copy lives in `lib/projects.ts`. Images come from the single Hygraph `Portfolio` entry:

- A project's card image is the asset whose file name matches its `cmsImageFileName`.
- Gallery images are named `<project-id>-gallery-<n>.<ext>`, e.g. `dash-detective-gallery-1.png`, and are shown in `<n>` order.

## CI

GitHub Actions runs on every pull request and on pushes to `main`. Vercel builds each commit separately.

- **CI:** typecheck, lint, format check, knip, unit tests, and `npm audit` on production dependencies, then a production build and the Playwright suite. CI has no Hygraph secrets, so `e2e/hygraph-stub.mjs` serves fixture content. To reproduce that locally:

  ```bash
  node e2e/hygraph-stub.mjs &
  HYGRAPH_ENDPOINT=http://localhost:3101/graphql HYGRAPH_TOKEN=stub npm run build
  HYGRAPH_ENDPOINT=http://localhost:3101/graphql HYGRAPH_TOKEN=stub CI=1 npm run test:e2e
  ```

- **CodeQL:** static analysis of the TypeScript and the workflows, also weekly.
- **Dependabot:** weekly grouped npm and Actions updates, each waiting 7 days after release.

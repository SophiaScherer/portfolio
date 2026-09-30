# Portfolio

Personal portfolio site for Sophia Scherer, built with Next.js (App Router), React, and Sass. Project images and the resume are served from Hygraph.

## Setup

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
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Vitest) |

## Content

Project copy lives in `lib/projects.ts`. Images come from the single Hygraph `Portfolio` entry:

- A project's card image is the asset whose file name matches its `cmsImageFileName`.
- Gallery images are named `<project-id>-gallery-<n>.<ext>`, e.g. `dash-detective-gallery-1.png`, and are shown in `<n>` order.

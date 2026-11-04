# Portfolio Audit, November 2026

**Date:** 2026-11-04
**Scope:** `main` at `24438c5`, after the fixes from the first audit (`docs/portfolio-audit.md`, PRs #16–#27) were merged. It covered the app, API route, content layer, hooks, styles, metadata, config, dependencies, tests, and CI.
**Fixes:** stacked PRs #28 → #29 → #30 → #31, each based on the one before it.

## How this audit was done

- Four parallel reviews covered server and lib code, components and hooks, styles and SEO, and config, dependencies, and CI. The findings below are merged and deduplicated.
- Each finding was checked against the code. The main ones were reproduced in a production build in a browser at 375 px and desktop widths, in both themes.
- Commands run: typecheck, lint, unit tests, production build, Playwright e2e and axe, `npm audit`, `npm outdated`, and knip.
- Rejected after checking:
  - "No contact route test": `app/api/contact/route.test.ts` exists.
  - "The page has no `revalidate`": the fetch's 60 s revalidate drives ISR, and the build output shows `1m`.
  - "`images` may be null": the schema declares `[Asset!]!`.
  - "The hamburger label duplicates `aria-expanded`": this is a common, valid pattern.
  - "Duplicate gallery keys": asset URLs are unique, and the gallery map already deduplicates.
- **Not verified:** Safari, Firefox, real devices, screen readers, and a real email send.

## Summary

| Severity | Count | Fixed | Left open |
|---|---|---|---|
| Critical | 1 | 1 | 0 |
| High | 2 | 2 | 0 |
| Medium | 7 | 7 | 0 |
| Low | 14 | 7 | 7 |

## Findings

| ID | Severity | Category | Location | Description | Impact | Recommendation | Verification | Status |
|---|---|---|---|---|---|---|---|---|
| AUD-01 | Critical | Security | `package-lock.json` (`next` 16.3.7) | `next` was within the range of about 10 advisories. They include RCE in image optimization and in `use cache`, SSG/ISR cache poisoning, and a Server Actions DoS. | A production framework with known critical advisories | Upgrade to 16.4.5 and raise the `package.json` floor | `npm audit --omit=dev` reports 0; build and e2e pass | Fixed in #28 |
| AUD-02 | High | Security | `package-lock.json` (`nodemailer` 10.0.12, transitive `source-map-js`) | Address-parser and SMTP ReDoS advisories | Reachable from the public contact form through `replyTo` | Upgrade `nodemailer` to 10.3.1 and run `npm audit fix` | As AUD-01 | Fixed in #28 |
| AUD-03 | High | CI / Security | `.github/` | No Dependabot, Dependabot alerts disabled, and no audit step in CI | This is how AUD-01 went unnoticed | Add Dependabot plus `npm audit` in CI | The config parses; the audit step passes | Fixed in #29. Repo setting still off, see Outstanding |
| AUD-04 | Medium | Security | `next.config.ts` | No security headers, and `X-Powered-By` was sent | The site could be framed; no MIME-sniffing protection | nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, a limited CSP, and `poweredByHeader: false` | e2e header test on `/` and the 404 page | Fixed in #28 |
| AUD-05 | Medium | Accessibility | `styles/_nav.scss`, `styles/_tokens.scss` | Theme toggle contrast: the track was 1.24:1 against the page and the sun icon 2.15:1 | Fails WCAG 1.4.11; low-vision users can barely see the control | A border in `--outline-strong` (3.48 light, 5.56 dark) and a sun icon of `#b45309` (5.0:1) | Contrast computed; checked visually in both themes | Fixed in #30 |
| AUD-06 | Medium | Accessibility | `components/Interests.tsx`, `hooks/useCarouselIndex.ts` | The interests track was always `tabIndex=0`, so it was an empty tab stop on the desktop grid. Its active dot went stale after a resize. | An extra, purposeless focus stop and a wrong `aria-current` | Focusable only while it overflows (ResizeObserver), which also recomputes the dot | e2e on desktop and mobile | Fixed in #30 |
| AUD-07 | Medium | Testing | `e2e/site.spec.ts`, `.github/workflows/ci.yml` | CI builds without Hygraph, so the image viewer test always skipped, and axe ran without images | The lightbox fix from #26 had no regression guard | A local Hygraph stub in CI; the test asserts instead of skipping there | Reproduced the CI flow locally; the test ran on both projects | Fixed in #29 |
| AUD-08 | Medium | CI | `.github/workflows/ci.yml` | Actions pinned to tags, no concurrency or timeouts, a duplicate build, and lint warnings that didn't fail CI | Supply-chain exposure, wasted runner time, and silent warnings | SHA pins, `concurrency`, timeouts, one build, and `--max-warnings 0` | GitHub runs on the PRs are green | Fixed in #29 |
| AUD-09 | Medium | Config | `package.json`, `.nvmrc` | No Node version declared | Vercel and CI could run different versions | `.nvmrc` and `engines: 22.x` | CI reads `.nvmrc` | Fixed in #29. Vercel setting needs confirming |
| AUD-10 | Medium | Maintainability | repo root | No formatter, with inconsistent quotes and indentation (e.g. `ProjectModal.tsx`) | Style drift and noisy diffs | Prettier for TS, JS, JSON, and YAML, plus `format:check` in CI | `npm run format:check`; the reformat is checked to be non-semantic | Fixed in #31 |
| AUD-11 | Low | Accessibility | `components/Navbar.tsx` | Choosing a section from the mobile menu returned focus to the hamburger | The next Tab starts from the nav instead of the section | Focus the section after scrolling, as a native anchor jump would | e2e | Fixed in #30 |
| AUD-12 | Low | Theming | `styles/_tokens.scss` | No `color-scheme` | With dark chosen on the site, scrollbars and autofill stay light | Declare `color-scheme` per theme | Computed style | Fixed in #30 |
| AUD-13 | Low | Theming | `app/layout.tsx`, `lib/theme.ts` | `theme-color` followed only the OS | A dark page inside light browser chrome, or the reverse | Put a theme-color meta first in `<head>`, kept in sync by the toggle | e2e after a toggle and after a reload | Fixed in #30 |
| AUD-14 | Low | UX | `styles/_animations.scss` | The fixed nav and decorative layers printed | The nav repeats on every printed page | Print rules hide them | Print preview | Fixed in #30 |
| AUD-15 | Low | Security | `lib/contact.ts` | The email regex allowed `"` | Quoted local parts reached `replyTo` | Reject `"` | Unit tests | Fixed in #28 |
| AUD-16 | Low | Tooling | `scripts/fetch-*.mjs` | No `response.ok` check | An error page could be saved as a font | `fetchOk` helper | Code read | Fixed in #29 |
| AUD-17 | Low | Docs | `README.md` | `npm run fonts`, the Node version, and CI were undocumented | Onboarding gaps | Document them | — | Fixed in #29 |
| AUD-18 | Low | Security | `next.config.ts` | The CSP has no `script-src` | Weaker XSS defense in depth | Nonces would force dynamic rendering of the static page; the XSS surface is nil (no user HTML, JSON-LD escaped) | — | Won't fix |
| AUD-19 | Low | Security | `lib/content.ts`, `components/ResumeLink.tsx` | CMS URLs are not scheme-checked | Only a CMS editor could inject a value; React 19 blocks `javascript:` hrefs | A host or scheme allowlist if more editors are added | — | Won't fix |
| AUD-20 | Low | Security | `lib/rate-limit.ts`, `app/api/contact/route.ts` | The limiter is per instance, and a missing IP shares the `unknown` bucket | Best effort only. Vercel overwrites `x-forwarded-for`, so it can't be spoofed there | Upstash or Turnstile if abuse appears | — | Accepted |
| AUD-21 | Low | SEO | `app/` | No `/favicon.ico` (404), and the SVG and Apple icons draw the "S" differently | Crawlers that request `/favicon.ico` get a 404; the brand mark is inconsistent | Add `app/favicon.ico` and draw the glyph as a path | `curl -I /favicon.ico` | Open |
| AUD-22 | Low | SEO | `app/page.tsx`, `app/sitemap.ts`, `components/Hero.tsx` | Thin Person JSON-LD (no `jobTitle`, `knowsAbout`, `image`), no sitemap `lastModified`, and the h1 doesn't include the name | Small missed search signals | Content decisions for the owner | Rich Results Test | Open |
| AUD-23 | Low | Functional | `hooks/useOverlayHistory.ts` | `history.state` keeps `{overlay}` after a reload, so one Back press after a reload does nothing visible | A minor oddity. The reported "menu stuck open" did not reproduce, because the entry the overlay was pushed from always exists | Strip stale overlay state on mount if it ever matters | Reproduced in a browser | Open |
| AUD-24 | Low | Dependencies | `package-lock.json` (`minimatch` via typescript-eslint) | 8 moderate advisories | Dev-only, and only reached through lint glob patterns | npm's only fix downgrades `eslint-config-next` to 15.x | `npm audit` | Accepted |

## Outstanding, needing the owner

- Turn on Dependabot alerts and security updates in the repository settings (AUD-03). `dependabot.yml` only schedules version updates.
- Confirm the Vercel project's Node version (AUD-09). `engines: 22.x` now overrides it.
- Optional: turn on secret scanning's non-provider patterns. Secret scanning and push protection are already on.
- AUD-21 and AUD-22 are content and branding choices.

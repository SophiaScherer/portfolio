# Portfolio Audit

**Date:** 2026-09-24
**Scope:** Whole repository at `8357e58` (`main`): the Next.js 16 app, the contact API route, Hygraph content access, hooks, and SCSS.
**No source code was modified.** This document is the only file added.

## How this audit was done

| Activity | What was run | Result |
|---|---|---|
| Code read | Every tracked file in `app/`, `components/`, `hooks/`, `lib/`, `styles/`, plus config | — |
| Type check | `npx tsc --noEmit` | Passes. Under `--strict` there are 6 errors (see CQ-03). |
| Build | `npx next build` (Turbopack, with `.env.local`) | Succeeds. `/` is prerendered with 1-minute ISR; `/api/contact` is dynamic. |
| Dependencies | `npm outdated`, `npm audit --omit=dev` | 7 vulnerabilities: 1 critical, 5 high, 1 moderate (see CQ-01) |
| Live walkthrough | `next start` viewed in a Chromium browser pane at 375×812, 768×1024, 1024×768, and 1440×900, in both light and dark color schemes | Details in each finding |
| Network | Resource timing, plus `curl -I` on every CMS asset the page references | Asset sizes are listed in UX-01 and UX-02 |
| Contrast | WCAG contrast ratios computed from the tokens in `styles/_tokens.scss` | UX-15 |
| Contact API | `curl` with invalid payloads only: bad JSON, missing fields, and a 5 MB body with an invalid email | Real email sends were not tested (see Open Questions) |

**Not verified:** Safari, Firefox, real iOS or Android devices, screen readers, and a valid contact-form send. Each finding says whether it was **verified** in the running site or **found by code reading**.

---

## 1. Summary, ranked by user impact

| Rank | ID | Severity | Issue | Who it hurts |
|---|---|---|---|---|
| 1 | UX-01 | High | The home page loads about 2 MB of full-resolution PNGs, including a 1.74 MB image, and preloads all of them in `<head>` even though they sit below the fold | Every visitor, and mobile visitors most |
| 2 | UX-05 | High | The contact API has no spam protection, rate limit, or size limits, and it sends through your Gmail SMTP account | You: an inbox flood or a suspended Gmail account would take down your contact channel |
| 3 | CQ-01 | High | Vulnerable `next` (critical advisories) and `nodemailer` (a DoS reachable through the form's `replyTo`) | You, and the site's availability |
| 4 | UX-02 | High | Opening a case study downloads every gallery image at full size, about 1.3 MB for DashDetective, to show 180 px thumbnails | Visitors who open projects |
| 5 | UX-03 | High | Browser Back or the Android back gesture doesn't close the case study, lightbox, or mobile menu. It changes the URL behind the overlay or leaves the site. | Every mobile visitor who opens a project |
| 6 | GAP-01 | High | No Open Graph or Twitter metadata, so sharing the link on LinkedIn, Slack, or iMessage shows a bare URL | Recruiters you send the link to |
| 7 | UX-04 | High | On the 404 page, and any future route, every nav and footer link points to a missing section, and there's no way home | Anyone who follows a bad link |
| 8 | UX-07/08 | Medium | Dark-mode visitors see a flash of the light theme on every load, and the theme ignores OS changes | Dark-mode users |
| 9 | UX-09 | Medium | Unguarded `localStorage` access can crash the whole page when storage is blocked | Privacy-hardened browsers (rare, but the failure is total) |
| 10 | UX-12–15 | Medium | Accessibility: project descriptions are hidden from screen readers, alt text is file names, icon names get read aloud, and some UI has low contrast | Screen reader and low-vision users |
| 11 | UX-10 | Medium | Every section below the hero stays invisible if JavaScript fails or is disabled, and when printing | Visitors with blocked JS, and anyone printing |
| 12 | UX-11 | Medium | `html { font-size: 16px }` overrides the visitor's browser font-size setting | Low-vision users |
| 13 | UX-23 | Medium | A brief Hygraph outage gets cached as a degraded page (no resume, placeholder images) for the ISR window | Visitors during and after a CMS blip |
| 14 | CQ-02/03 | Medium | No tests, no lint, no CI, and TypeScript `strict` is off | Future you: regressions land silently |
| — | the rest | Low | Polish, DRY, and dead code | — |

**What already works well:** No horizontal overflow at 375, 768, or 1440 px. The mobile menu uses `inert` and a working focus trap. Escape correctly layers the lightbox over the modal. Focus returns to the card that opened the modal. Reduced motion is respected. Inputs are 16 px on phones, so iOS doesn't zoom. The nav's active state tracks all the way to Contact. The menu closes itself when the window is resized to desktop width. CMS failures don't 500 the page.

---

## 2. Findings

### Phase 1: UX walkthrough

#### UX-01 — Oversized, eagerly preloaded project images on first load
- **Severity:** High · **Effort:** S–M · **Status:** Verified
- **Where:** `components/ProjectCard.tsx:56`, `:102`, `:121`; `lib/content.ts:65-71`; page `/`
- **What happens:** All three card images are served as original PNGs from the Hygraph CDN, and React emits `<link rel="preload" as="image">` for each one in the SSR `<head>`. I saw this in the served HTML. Measured sizes:
  - The vector-field image (`cmqv9lec…`) is **1,744,922 bytes**. It displays at 360×307, but its natural size is 1559×768.
  - The unPawse image is 153,944 bytes. It displays at 248×148, but its natural size is 1080×2400.
  - The DashDetective image is 155,326 bytes. It displays at 447×260, but its natural size is 1313×792.

  That's about **2.05 MB of images versus about 155 KB (gzipped) of JS**. None of these images is above the fold: the hero has no images. Preloads get high priority, so they compete with fonts and CSS on the critical path.
- **Repro:** Load `/` with DevTools open, then check Network → Img, or view the source and look for the `rel="preload" as="image"` tags.
- **Why it matters:** On a phone over 4G, 2 MB is several seconds of bandwidth before the page settles, and it costs mobile data. It also drags down the Speed Insights scores you're already collecting.
- **Fix:**
  1. Ask Hygraph for resized WebP images. You can use the GraphQL `url(transformation: …)` argument or URL-based transforms. Check the exact syntax against your project's API version.
     ```graphql
     images(first: 100) {
       fileName width height
       url(transformation: {
         image: { resize: { width: 1200, fit: clip } }
         document: { output: { format: webp } }
       })
     }
     ```
     Another option is `next/image` with `images.remotePatterns` for `us-west-2.graphassets.com`, but that uses up Vercel image-optimization quota.
  2. Add `loading="lazy" decoding="async"` to card `<img>`s. React should stop emitting preloads for lazy images, but confirm that in the output HTML.
  3. Pass the `width` and `height` you already fetch (currently unused) through to `<img>` as intrinsic size hints.
  4. Re-export `vectorVisPicture.png` in the CMS as WebP or JPEG. As a PNG of a noise texture it compresses poorly.

#### UX-02 — Case-study gallery loads full-size originals for thumbnails
- **Severity:** High · **Effort:** S · **Status:** Verified
- **Where:** `components/ProjectModal.tsx:226-236` (thumbnails), `:165` (header image); `lib/content.ts:201`
- **What happens:** The DashDetective gallery has 8 thumbnails: the header image plus 7 gallery images. Each thumbnail is a 180 px-tall `<img>` pointing at the original asset. The seven gallery files alone are 83–172 KB each, about **800 KB**. All the gallery assets referenced by the page add up to about 2 MB. Every image downloads the moment the modal opens, and none has `loading="lazy"`.
- **Repro:** Open DashDetective and watch the Network panel.
- **Why it matters:** This path gets slow on mobile, and the thumbnails pop in while the modal is animating.
- **Fix:** In `getProjectGalleryMap`, return a `thumbUrl` (for example, 400 px wide) and a `fullUrl` (for example, 1600 px wide, WebP). Use `thumbUrl` with `loading="lazy"` in the track and `fullUrl` only in `Lightbox`.
  ```ts
  export type GalleryImage = { url: string; thumbUrl: string; alt: string };
  ```

#### UX-03 — Back button and back gesture don't close overlays
- **Severity:** High · **Effort:** M · **Status:** Verified
- **Where:** `components/Projects.tsx:28-47`, `components/ProjectModal.tsx`, `components/Lightbox.tsx`, `hooks/useHamburger.ts`
- **What happens:** Opening a case study, the lightbox, or the mobile menu doesn't add a history entry. Pressing Back while the modal is open:
  - If you arrived with no in-site history, Back leaves the site. In a fresh tab, the browser reported "no back history".
  - If you had clicked a nav link first, Back changes the URL from `/#experience` to `/`, and **the modal stays open with body scroll still locked**. I verified this.
- **Repro:** Click "Experience" in the nav, open the unPawse card, then press Back.
- **Why it matters:** On Android, Back is the main way to dismiss things. Visitors lose their place or leave the portfolio entirely.
- **Fix:** Push a history entry when an overlay opens, close it on `popstate`, and have the UI close buttons call `history.back()`. If you also want deep links (GAP-05), use a hash or query per project.
  ```ts
  // Projects.tsx (sketch)
  const open = (id: string) => { history.pushState({ project: id }, "", `#project-${id}`); setExpandedId(id); };
  const close = () => { if (history.state?.project) history.back(); else setExpandedId(null); };
  useEffect(() => {
    const onPop = () => setExpandedId(history.state?.project ?? null);
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);
  ```
  Apply the same pattern to the lightbox (nested state) and the mobile menu. See Open Question 4 before choosing the URL format.

#### UX-04 — Dead navigation on the 404 page and any non-root route
- **Severity:** High · **Effort:** S · **Status:** Verified
- **Where:** `components/Navbar.tsx:43`, `:49`, `:28-33`; `components/Footer.tsx:7`; no `app/not-found.tsx`
- **What happens:** `/some-missing-page` renders Next's default unstyled "404 | This page could not be found." inside your navbar. Clicking "Projects" goes to `/some-missing-page#projects`, which does nothing. The logo (`#about`) is also dead, so there's no way back home. The mobile-menu handler calls `getElementById(id)?.scrollIntoView()`, which is a no-op there, and then `pushState`s a hash onto the missing page.
- **Why it matters:** Mistyped or outdated links, for example from an old résumé, strand the visitor.
- **Fix:** Use `/#id` hrefs in `NAV_LINKS` consumers and the logos. In `goToSection`, fall back to `location.assign(\`/#${id}\`)` when the element doesn't exist. Add an `app/not-found.tsx` styled like the site, with a "Back to home" button. See GAP-06.

#### UX-05 — Contact API is open to spam and abuse
- **Severity:** High · **Effort:** M · **Status:** Verified: a 5 MB body was accepted and parsed. Rate limiting is absent in the code.
- **Where:** `app/api/contact/route.ts:20-102`; `components/Contact.tsx`
- **What happens:** Any client can POST as often as it likes. There's no honeypot, CAPTCHA, rate limit, or field-length cap. A 5 MB `message` with an invalid email got a 400 in 17 ms, meaning it was fully read and parsed. With a valid email it would be emailed to you. The email regex also accepts comma lists such as `a,b,c@x.y`, which are passed straight into `replyTo`.
- **Why it matters:** A bot can flood your inbox. Gmail SMTP enforces daily send limits and can suspend the account, which would silently break the contact form. Oversized bodies also waste function time.
- **Fix:**
  - Add a hidden honeypot field and a minimum fill time, for example rejecting submissions under 3 s after render.
  - Cap lengths: name ≤ 100, email ≤ 254, message ≤ 5,000. Reject by `Content-Length` before calling `req.json()`.
  - Add a per-IP rate limit, for example 5 per hour. Upstash Redis or Vercel KV works; an in-memory map per instance is only a weak stopgap.
  - Optionally add Cloudflare Turnstile. See Open Question 6.
  ```ts
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return json413();
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: pretend success
  ```

#### UX-06 — (merged into CQ-01)

#### UX-07 — Light-theme flash for dark-mode visitors
- **Severity:** Medium · **Effort:** S · **Status:** Verified. The SSR HTML has `data-theme="light"`, and the page switched to dark only after hydration under an emulated dark OS.
- **Where:** `app/layout.tsx:58`; `hooks/useTheme.ts:28-32`
- **What happens:** The server always renders the light theme. The switch to dark happens in a `useEffect` after hydration, so dark-mode users see a cream page, then dark, on every load. The toggle icon also flips late.
- **Fix:** Add a tiny blocking script in `<head>` that sets `data-theme` before first paint, and keep `suppressHydrationWarning`, which is already there.
  ```tsx
  <script dangerouslySetInnerHTML={{ __html:
    `try{var t=localStorage.getItem("portfolio-theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}` }} />
  ```
  Then have `useTheme` read the initial value from `document.documentElement.dataset.theme`.

#### UX-08 — Theme doesn't follow OS changes
- **Severity:** Low · **Effort:** S · **Status:** Verified: switching the emulated OS scheme to dark left `data-theme="light"`.
- **Where:** `hooks/useTheme.ts`
- **Fix:** When there's no stored preference, listen to `matchMedia("(prefers-color-scheme: dark)")` `change` events. Optionally offer a "system" state.

#### UX-09 — Blocked storage can crash the page
- **Severity:** Medium (rare, but total failure) · **Effort:** S · **Status:** Found by code reading, not reproduced
- **Where:** `hooks/useTheme.ts:11`, `:39`
- **What happens:** When site data is blocked (for example, Chrome's "Block all cookies"), accessing `window.localStorage` throws `SecurityError`. That happens inside the mount effect, and there's no `error.tsx` or `global-error.tsx`. The uncaught client exception replaces the page with Next's "Application error" screen.
- **Fix:** Wrap every storage access in `try/catch`, and add an error boundary (GAP-06).
  ```ts
  const readStored = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
  ```

#### UX-10 — Sections invisible without JS, and when printing
- **Severity:** Medium · **Effort:** S · **Status:** Found by code reading
- **Where:** `styles/_animations.scss:28`; `hooks/useReveal.ts`
- **What happens:** `.reveal { opacity: 0 }` applies to every heading and card below the hero. It becomes visible only when the IntersectionObserver adds `.visible`. If JS is disabled, fails to load, or crashes (UX-09), or if the page is printed, those sections render blank.
- **Fix:** Only hide when JS is running, and force visibility in print.
  ```scss
  .js .reveal:not(.visible) { opacity: 0; }   // set <html class="js"> in the UX-07 head script
  @media print { .reveal { opacity: 1 !important; animation: none !important; } }
  ```

#### UX-11 — Browser font-size setting is ignored
- **Severity:** Medium · **Effort:** S · **Status:** Found by code reading
- **Where:** `styles/_reset.scss:3` (`font-size: 16px`)
- **What happens:** Setting the root size in `px` overrides the visitor's browser default. For example, Chrome's Settings → Appearance → Font size → Large (20 px) has no effect, so all `rem` text stays the same size. Page zoom still works.
- **Fix:** Remove the declaration or use `font-size: 100%`. Then spot-check the nav at 20 px: the fixed `--nav-height: 80px` and the `nowrap` logo are the likely pressure points.

#### UX-12 — Project cards hide their content from assistive tech
- **Severity:** Medium · **Effort:** M · **Status:** Found by code reading
- **Where:** `components/ProjectCard.tsx:40-46`, `:50-82`, `:117-152`
- **What happens:** The image and icon variants wrap an `<h3>`, `<p>`, and `<div>`s inside a `<button>` that also has an `aria-label`. That's invalid HTML: `<button>` allows only phrasing content. Buttons' children are also presentational, so screen readers announce only "Open case study: DashDetective, button". The description, tags, and stats are unreachable, and the project titles don't appear in the heading list.
- **Fix:** Use the pattern the `wide` variant already has. Render each card as an `<article>` with a real `<h3>` and body, and add a stretched overlay `<button>` labeled "Open case study". Drop the `aria-label` override, or put the button around the title text only. This also deletes two of the three click-target code paths.

#### UX-13 — Gallery alt text is file names
- **Severity:** Medium · **Effort:** S · **Status:** Verified: the alts are `dash-detective-gallery-1.png` … `-7.png`
- **Where:** `lib/content.ts:201`; used by `components/ProjectModal.tsx:234` and the lightbox's `aria-label` in `components/Lightbox.tsx:101`
- **Fix:** Add an `alt` or `caption` field to Hygraph assets and query it. Until then, fall back to `` `${project.title} screenshot ${n}` ``.

#### UX-14 — Icon ligature names read aloud
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading
- **Where:** `components/Interests.tsx:28` ("insights", "settings", "handshake", "lightbulb"); `components/Contact.tsx:109` ("location_on")
- **Fix:** Add `aria-hidden="true"` to those `material-symbols-outlined` spans, as the rest of the codebase already does.

#### UX-15 — Low-contrast UI elements
- **Severity:** Medium · **Effort:** S · **Status:** Computed from tokens
- **Where:** `styles/_contact.scss:89`, `styles/_carousel.scss:48`, `styles/_interests.scss:36`, `styles/_contact.scss:100`
- **What happens:**

  | Element | Light | Dark | Requirement |
  |---|---|---|---|
  | Form input borders (`--outline`) | 1.36:1 | 1.46:1 | 3:1 (WCAG 1.4.11) |
  | Inactive carousel dots | 1.34:1 | 1.43:1 | 3:1 |
  | Interest card "01" eyebrows (0.68rem at `opacity: 0.7`) | 3.46:1 | 5.33:1 | 4.5:1 |
  | Placeholders (at `opacity: 0.7`) | 4.04:1 | 3.80:1 | 4.5:1 |

- **Fix:** Add an `--outline-strong` token (≥ 3:1 against `--surface`) for input borders and dots. Remove the `opacity: 0.7` on the eyebrow and the placeholder.

#### UX-16 — Contact form interaction gaps
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading, and validation was verified in the browser
- **Where:** `components/Contact.tsx`
- **What happens:**
  1. There are no `autoComplete` attributes, so autofill is unreliable.
  2. After a failed submit, focus stays on the button instead of moving to the first invalid field.
  3. `disabled={sending}` removes focus from the active element mid-submit, and screen readers lose their place.
  4. The "Message sent!" banner stays up while the visitor types a new message.
  5. `await res.json()` at `:55` throws on non-JSON responses, such as a platform 413 or 504 HTML page, and the visitor sees a misleading "Network error".
- **Fix:**
  1. Add `autoComplete="name"` and `"email"`.
  2. Focus the first field with an error.
  3. Use `readOnly` plus `aria-busy` instead of `disabled`.
  4. Reset `status` to idle in `onChange`.
  5. Guard the parse with `res.headers.get("content-type")?.includes("json")`.

#### UX-17 — Page shifts when the modal or menu opens (desktop)
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading. Scrollbars were visible in the Windows screenshots, but the shift wasn't measured.
- **Where:** `hooks/useModal.ts:81`
- **What happens:** `body { overflow: hidden }` removes the classic scrollbar, so the whole page jumps sideways by about 15 px behind the backdrop.
- **Fix:** `html { scrollbar-gutter: stable; }` in `_reset.scss`.

#### UX-18 — Modal content jumps during the close animation
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading
- **Where:** `components/Projects.tsx:89-91`; `components/ProjectModal.tsx:59-70`
- **What happens:** On close, `expandedId` becomes `null`, so `galleryImages` switches to `NO_GALLERY` immediately. The project itself is held in `lastProject` for the fade-out, but the gallery isn't, so the gallery section disappears and the card shrinks mid-fade.
- **Fix:** Pass `galleryImages` for the displayed project. For example, resolve it inside the modal from `shown.id`, or keep a `lastGallery` ref next to `lastProject`.

#### UX-19 — Résumé link behavior
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading
- **Where:** `components/Navbar.tsx:130-139`
- **What happens:** Browsers ignore `download={resume.fileName}` on cross-origin URLs (the Hygraph CDN), so the link just opens a new tab. The label "Resume" doesn't say it's a PDF or that it opens a new tab. The résumé also isn't reachable from the hero or the Contact section, and on phones it's hidden inside the hamburger menu.
- **Fix:** Remove `download`, or proxy the file through a route that sets `Content-Disposition`. Label it "Resume (PDF)". Consider a résumé CTA in the hero (GAP-04).

#### UX-20 — Footer inconsistencies
- **Severity:** Low · **Effort:** S · **Status:** Verified
- **Where:** `components/Footer.tsx:7`, `:10`, `:15`
- **What happens:**
  - Footer social links open in the same tab, but the mobile menu opens the same links in a new tab (`Navbar.tsx:109`).
  - The footer links are 48×20 px tap targets.
  - "© 2026" is hard-coded.
- **Fix:** Share one `SocialLinks` component. Add `padding-block: 12px`. Use `new Date().getFullYear()`, which is fine in a server component and refreshes with ISR.

#### UX-21 — Developer placeholder text shown to visitors
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading
- **Where:** `components/ProjectCard.tsx:22-28`
- **What happens:** When a CMS image is missing, which includes any time Hygraph is unreachable (UX-23), the cards show "app screenshot / GIF".
- **Fix:** Use a neutral branded placeholder, such as the project's icon or title on the striped background, with no instructional copy.

#### UX-22 — Render-blocking third-party icon font
- **Severity:** Low · **Effort:** M · **Status:** Verified: it's a blocking `<link rel="stylesheet">` to `fonts.googleapis.com`
- **Where:** `app/layout.tsx:65-71`; `lib/icons.ts`
- **What happens:** The icon stylesheet blocks rendering and costs two extra origins (DNS, TLS). `display=block` hides icons for up to about 3 s on slow networks. The icon list also includes `query_stats`, which nothing uses.
- **Fix:** Download the subset `woff2` once and load it with `next/font/local`, which makes it same-origin and preloaded. Or keep the current setup and switch to `display=swap`, accepting a brief flash of icon names. Remove `query_stats`.

#### UX-23 — CMS blips get cached as a degraded page
- **Severity:** Medium · **Effort:** S · **Status:** Found by code reading
- **Where:** `lib/content.ts:100-111`; `lib/hygraph.ts:70`
- **What happens:** `getPortfolioContent` catches every error and returns `null` so the page never 500s. But under ISR (`revalidate: 60`), a regeneration during a Hygraph blip now succeeds. The last good page is replaced with one that has no résumé link and placeholder images, and that version is served until a later regeneration succeeds. If a regeneration threw instead, Next would keep serving the previous good page. The `fetch` also has no timeout, so a hanging CMS stalls regeneration.
- **Fix:** Degrade only when there's no previous page, which means at build time, and throw otherwise. Add `signal: AbortSignal.timeout(5000)` to the fetch. See Open Question 5.
  ```ts
  if (process.env.NEXT_PHASE !== "phase-production-build") throw error; // let ISR keep the last good page
  ```

#### UX-24 — Keyboard and semantic polish
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading
- **Where:** `app/layout.tsx`, `components/ThemeToggle.tsx:9-20`, `components/Navbar.tsx:40`
- **What happens:**
  - There's no "Skip to content" link, so keyboard users tab through 8 header controls first.
  - The theme toggle has a static label and no `aria-pressed`, so its state is invisible to screen readers.
  - The header wrapper is a `<div>` rather than `<header>`.
- **Fix:** Add a visually hidden skip link to `#projects` or to `<main id="main">`. Use `aria-pressed={theme === "dark"}` with the label "Dark mode". Change the wrapper to `<header className="site-header">`.

#### UX-25 — Theme toggle animates the whole page
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading, not profiled
- **Where:** `transition: … 0.35s` on `body`, `.card`, `.h1`–`.h3`, and roughly 40 more selectors
- **What happens:** Switching themes animates colors on hundreds of elements at once, which may stutter on low-end phones.
- **Fix:** Add a `theme-switching` class that sets `transition: none !important` for one frame around the attribute change. That also lets you delete most of the per-selector `transition: color 0.35s` lines (CQ-06).

#### Cross-browser notes
- Verified in Chromium only. The build output does include the `-webkit-backdrop-filter` prefixes Safari needs.
- The CSS and JS features in use (`inert`, `100svh`, `checkVisibility` with fallback, `text-wrap`, individual `rotate`) need Safari 15.5 or later. Older browsers degrade gracefully except `inert`: on Safari before 15.5, the hidden mobile menu's links stay focusable, so focus can land on invisible links.
- Not tested: iOS Safari scroll locking inside the modal, and Firefox scroll-snap behavior in the Interests carousel. See Open Question 3.

---

### Phase 2: Gap analysis

#### Real gaps (expected by visitors)

| ID | Severity | Gap | Suggested fix | Effort |
|---|---|---|---|---|
| GAP-01 | High | **No link-preview metadata.** No `openGraph`, `twitter`, `metadataBase`, or OG image, so links shared in LinkedIn DMs, Slack, or iMessage render as bare URLs. | Add `metadataBase`, `openGraph` (title, description, url, siteName), and `twitter: { card: "summary_large_image" }` to `metadata` in `app/layout.tsx`. Add `app/opengraph-image.tsx` (generated with `ImageResponse`) or a static 1200×630 image. | S |
| GAP-02 | Medium | **No favicon or app icons.** `/favicon.ico` returns 404, so tabs and bookmarks show a generic icon. | Add `app/icon.png` (or `.svg`) and `app/apple-icon.png`. | S |
| GAP-03 | Medium | **No direct contact option beside the form.** The Contact section shows only the form and "Woodinville, WA". There's no email address, and there are no GitHub or LinkedIn links: on desktop they appear only in the footer. | Add email (a `mailto:` link or a copy button), LinkedIn, and GitHub rows to `.contact-links`, reusing the existing `.contact-link` styles (which are currently unused, see CQ-09). | S |
| GAP-04 | Medium | **The résumé is hard to find.** It's only in the top nav on desktop and hidden in the menu on phones. The hero has "Projects" and "Contact Me" but no résumé. | Add a third hero CTA, or swap "Contact Me" for "Resume (PDF)", since Contact is one scroll away. | S |
| GAP-05 | Medium | **Case studies can't be linked.** You can't send someone straight to "unPawse". | Comes free with the UX-03 fix if it uses `#project-<id>` or `?project=<id>`. Open the matching modal on load. | M (with UX-03) |
| GAP-06 | Medium | **No custom 404 or error boundary.** Next's default pages appear, unstyled. | Add `app/not-found.tsx` and `app/error.tsx` (client) with a "Back to home" button, plus `app/global-error.tsx`. | S |
| GAP-07 | Low | **No `robots.txt` or `sitemap.xml`** (both 404). | `app/robots.ts` and `app/sitemap.ts`, about 10 lines each. | S |
| GAP-08 | Low | **Content consistency** (your call, see Open Question 8). The skills list omits languages the projects use (C#, Kotlin, XAML, .NET, Jetpack Compose, Avalonia) but lists some with no visible project (Java, MongoDB). The "Work" timeline's first entry is the degree. GPA and class year appear in both Hero and Experience. The nav's "About" link goes to the hero, which isn't really an About section. | Edit the content, then data-drive it (CQ-07). | S |

#### Nice-to-haves
- Swipe navigation and pinch-zoom in the lightbox on touch devices. Today there are only 42 px arrow buttons.
- Live demo, video, or download links on case studies, alongside GitHub.
- A profile photo or avatar in the hero. The right-hand panel is sparse at 1440 px.
- JSON-LD `Person` structured data (name, alumniOf, sameAs for GitHub and LinkedIn) for richer search results.
- Vercel Analytics custom events for résumé clicks, case-study opens, and contact submissions, since you already ship `@vercel/analytics`.
- A print stylesheet so the page prints cleanly (pairs with UX-10).
- `theme-color` meta tags for the mobile browser chrome in each theme.

---

### Phase 3: Code quality review

#### CQ-01 — Vulnerable dependencies
- **Severity:** High · **Effort:** S · **Status:** Verified with `npm audit --omit=dev`
- **Where:** `package.json`, `package-lock.json`
- **What happens:**
  - **`next` 16.2.9:** Covered by several advisories rated up to critical, fixed in 16.3.6. Most target features this site doesn't use (middleware, Server Actions, the image optimizer, rewrites). But the patch is a minor bump, and one advisory concerns response cache confusion for requests with bodies. Not worth reasoning about; just upgrade.
  - **`nodemailer` 9.0.1:** Advisories through 9.1.0, including a quadratic-time `addressparser` DoS that the public form can reach through `replyTo: email`, since there's no length cap (UX-05). Fixed in 9.1.1.
  - **Transitive:** `postcss` (via next), `sharp`, `immutable` (via sass), `nanoid`, `baseline-browser-mapping`.
- **Fix:**
  ```bash
  npm install next@^16.3.6 nodemailer@^9.1.1 && npm audit fix
  ```
  Rebuild and smoke test. Consider adding Dependabot or Renovate (CQ-02).

#### CQ-02 — No tests, lint, or CI
- **Severity:** Medium · **Effort:** M–L · **Status:** Verified: there's no test runner, ESLint config, or `.github/` directory
- **Where:** Repo root. `hooks/useReveal.ts:44` has an `eslint-disable` directive, but there's no ESLint to honor it.
- **Why it matters:** Several findings above (UX-03, UX-04, UX-18) are the kind of regressions a small test suite catches. The CMS filename conventions in `lib/content.ts` (`-gallery-<n>`, duplicate handling) are pure logic that's easy to unit test and easy to break.
- **Fix:**
  - **Lint:** `eslint` with `eslint-config-next` (core-web-vitals plus `react-hooks`).
  - **Unit:** Vitest for `getProjectGalleryMap` and `getProjectImageMap` (mock `request`), and for shared contact validation (CQ-04).
  - **E2E:** Playwright smoke tests: open and close the modal with Escape and Back, the mobile menu, form validation, 404 navigation, and an axe-core scan.
  - **CI:** A GitHub Actions workflow running `tsc`, lint, test, and `next build` on PRs.

#### CQ-03 — TypeScript `strict` is off, and `@types/react-dom` is missing
- **Severity:** Medium · **Effort:** S–M · **Status:** Verified: `tsc --strict` gives 6 errors
- **Where:** `tsconfig.json:11`; `components/Lightbox.tsx:4`, `Navbar.tsx:4`, `ProjectModal.tsx:4` (untyped `react-dom`, so `createPortal` and `flushSync` are `any`); `hooks/useCarouselIndex.ts:80`, `useModal.ts:153`, `useReveal.ts:47` (`RefObject<T | null>` vs `RefObject<T>`)
- **Fix:** `npm i -D @types/react-dom`. Change the hook return types to `RefObject<T | null>`. Set `"strict": true`. Also drop `"allowJs": true` (no JS sources exist) and raise `target` above ES2017.

#### CQ-04 — Contact validation duplicated between client and server
- **Severity:** Low · **Effort:** S · **Status:** Found by code reading
- **Where:** `components/Contact.tsx:8-16` vs `app/api/contact/route.ts:16-44`
- **What happens:** The email regex and the required-field messages are copy-pasted, and they've already drifted: the server rejects multi-line names, but the client doesn't check for them. Length caps from UX-05 would be a third copy.
- **Fix:** Create a `lib/contact.ts` exporting `validateContact(input): Errors` and `LIMITS`, and import it from both sides. It has no `server-only` code, so it's safe in the client bundle.

#### CQ-05 — Triplicated field wiring in `Contact.tsx`
- **Severity:** Low · **Effort:** S · **Where:** `components/Contact.tsx:117-194`
- **Fix:** Extract a `<Field name label as="input|textarea" … />` component, or keep values in one `useState<Record<Field, string>>` with a single `onChange`/`onBlur` pair. That cuts about 70 lines and makes UX-16's fixes one-liners.

#### CQ-06 — Repeated SCSS
- **Severity:** Low · **Effort:** M · **Status:** Found by code reading
- **What happens:**
  - The focus ring `box-shadow: 0 0 0 3px var(--bg), 0 0 0 5px var(--secondary)` is repeated about 10 times (`_projects`, `_modal`, `_lightbox`, `_buttons`).
  - The easing `cubic-bezier(0.25,0.46,0.45,0.94)` appears about 20 times, although `--reveal-ease` already defines it.
  - The button reset (`appearance:none; padding:0; font:inherit; …`) appears 5 times.
  - `.btn-send` (`_contact.scss:142-184`) duplicates `.btn-primary` almost line for line.
  - `transition: color 0.35s` is on about 40 selectors (see UX-25).
  - The dimmed timeline dot colors are hard-coded hex values outside the token file (`_experience.scss:69-74`).
- **Fix:** Add `@mixin focus-ring($color: var(--secondary))`, `@mixin button-reset`, and an `--ease-out` token. Make the submit button `className="btn-primary btn-send"` and keep only the differences. Move the timeline tones into `_tokens.scss`.

#### CQ-07 — Hard-coded profile content, and duplicated facts
- **Severity:** Low · **Effort:** S–M · **Status:** Found by code reading
- **Where:**
  - `components/Experience.tsx` (skills and timeline written as JSX)
  - `components/Hero.tsx:53`, `:59` and `Experience.tsx:64`, `:68` (GPA "3.59" and graduation year in two places)
  - "Sophia Scherer" in `Navbar.tsx:44`, `Footer.tsx:8`, `Hero.tsx:11`, `layout.tsx:32`
  - `type Resume` in `Navbar.tsx:12` duplicates `ResumeDownload` in `lib/content.ts`
- **Fix:** Add a `lib/profile.ts` (name, GPA, graduation year, location, email) and a `lib/experience.ts` (skills groups, timeline items), matching the existing `lib/interests.ts` pattern. Import `ResumeDownload` as a type instead of redeclaring it.

#### CQ-08 — More client JavaScript than needed
- **Severity:** Low · **Effort:** S–M · **Status:** Verified: about 155 KB of JS gzipped (about 540 KB decoded) on first load
- **Where:**
  - `components/Experience.tsx:1` is a client component only to call `useReveal`. `Interests.tsx` is the same, plus the carousel.
  - `components/Projects.tsx:32-39` re-maps every project and runs `warnOnDuplicateVariants` on every render, including each modal open and close.
- **Fix:** Replace the per-section `useReveal` with one small `<RevealObserver />` client component in the layout that observes every `.reveal` in the document. Then `Experience` becomes a server component. Resolve `imageUrl` (and run the variant check) once in `app/page.tsx` on the server, and pass the already-resolved projects down.

#### CQ-09 — Dead and unused code
- **Severity:** Low · **Effort:** S · **Status:** Verified by grep
- **What's unused:**
  - `lib/icons.ts:26`: the `query_stats` icon.
  - `styles/_base.scss:34`: `.text-muted`.
  - `styles/_contact.scss:49-57`: `.contact-link` hover and focus styles on a non-interactive `<div>`.
  - `_contact.scss:130`, `:135`, `:140`, `:181-184`: status icons and `.btn-send .btn-icon`, which nothing renders.
  - `hooks/useTheme.ts`: the `theme` return value (`ThemeToggle` ignores it).
  - `hooks/useReveal.ts`: the `threshold`, `rootMargin`, and `once` options (never passed).
  - `lib/content.ts`: the query fetches `id`, `title`, `mimeType`, `width`, and `height`, none of which is read. Use `width`/`height` for UX-01 and drop the rest.
  - `package.json`: the `postcss` devDependency (Next bundles its own, and there's no PostCSS config).
- **Fix:** Delete them, or wire them up where noted.

#### CQ-10 — `useTheme` mutates React-owned DOM and has side effects in a state updater
- **Severity:** Low · **Effort:** S · **Where:** `hooks/useTheme.ts:18-23`, `:34-43`
- **What happens:** `applyTheme` sets `#themeIcon.textContent` directly on a node React renders. It works only because React never re-renders that text. Side effects (`applyTheme`, `localStorage.setItem`) run inside `setTheme`'s updater, which React may call twice in development.
- **Fix:** Render the icon from state (`{theme === "dark" ? "dark_mode" : "light_mode"}`), and apply the attribute and storage in a `useEffect([theme])`. Do this together with UX-07, UX-08, and UX-09.

#### CQ-11 — Small duplications in the modal code
- **Severity:** Low · **Effort:** S · **Where:** `components/Lightbox.tsx:31-34` and `ProjectModal.tsx:51-54` (the "mounted for portal" pattern); `Lightbox.tsx:40`, `:42`, `:52-53` (wrap-around index math written three times)
- **Fix:** Add a `useIsClient()` hook (`useSyncExternalStore(() => () => {}, () => true, () => false)`) and `const wrap = (i: number, n: number) => (i + n) % n`.

#### CQ-12 — Contact route robustness
- **Severity:** Low · **Effort:** S · **Where:** `app/api/contact/route.ts:53-66`, `:69-74`
- **What happens:** The "Mail server is not configured. Set SMTP_HOST…" message goes to the visitor and exposes internal configuration. The transporter has no timeouts; nodemailer's defaults are measured in minutes, so a stuck SMTP connection holds the function until the platform kills it.
- **Fix:** Log the configuration detail server-side, and return a generic "Messaging is temporarily unavailable" to the client. Pass `connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 15_000`.

#### CQ-13 — Unbounded reveal delay in Interests
- **Severity:** Low · **Effort:** S · **Where:** `components/Interests.tsx:24`
- **What happens:** `reveal-delay-${i + 1}` produces a class that doesn't exist once there's a fifth interest. `Projects.tsx` already clamps its delay with `MAX_REVEAL_DELAY`.
- **Fix:** Export one `revealDelayClass(i)` helper from `lib/format.ts` and use it in both places.

#### CQ-14 — Repo hygiene
- **Severity:** Low · **Effort:** S · **Status:** Verified
- **What happens:**
  - `package.json` says `"license": "ISC"`, but `LICENSE` is MIT.
  - `description` and `author` are empty.
  - `next-env.d.ts` is committed but also listed in `.gitignore:6`.
  - `.env.example` lacks `HYGRAPH_ENDPOINT` and `HYGRAPH_TOKEN`, so a fresh clone builds "successfully" with no CMS content and only a console error.
  - There's no README.
- **Fix:** Correct the license field, add the two env vars to `.env.example` with comments, pick one approach for `next-env.d.ts` (Next recommends ignoring it), and add a short README covering setup, env vars, and the CMS asset naming convention (`<project-id>-gallery-<n>.<ext>`).

---

## 3. Proposed order of work

The fixes are grouped so each batch touches one cluster of files. Batches 1–3 are the most impactful and can each be a single PR.

| # | Batch | Findings | Files | Effort |
|---|---|---|---|---|
| 1 | **Dependency and type safety** | CQ-01, CQ-03 (`@types/react-dom`), CQ-09 (`postcss`), CQ-14 (license, `.env.example`) | `package.json`, `package-lock.json`, `.env.example` | S |
| 2 | **Images and the case-study modal** | UX-01, UX-02, UX-13, UX-18, UX-21, UX-12, CQ-11 | `lib/content.ts`, `components/ProjectCard.tsx`, `ProjectModal.tsx`, `Lightbox.tsx`, `Projects.tsx`, `styles/_projects.scss` | M |
| 3 | **Contact hardening** | UX-05, UX-16, CQ-04, CQ-05, CQ-12, UX-14 (location icon) | `app/api/contact/route.ts`, `components/Contact.tsx`, new `lib/contact.ts`, `styles/_contact.scss` | M |
| 4 | **History and deep links** (do after batch 2, same files) | UX-03, GAP-05 | `components/Projects.tsx`, `ProjectModal.tsx`, `Lightbox.tsx`, `hooks/useHamburger.ts`, `components/Navbar.tsx` | M |
| 5 | **Document shell: theme, head, and metadata** | UX-07, UX-08, UX-09, CQ-10, UX-10, UX-11, UX-17, UX-22, UX-24, UX-25, GAP-01, GAP-02, GAP-07 | `app/layout.tsx`, `hooks/useTheme.ts`, `components/ThemeToggle.tsx`, `styles/_reset.scss`, `_animations.scss`, new `app/opengraph-image.tsx`, `app/icon.png`, `app/robots.ts`, `app/sitemap.ts` | M |
| 6 | **Routes and navigation** | UX-04, GAP-06, UX-19, UX-20 | `components/Navbar.tsx`, `Footer.tsx`, `lib/links.ts`, new `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx` | S |
| 7 | **CMS resilience** | UX-23 | `lib/content.ts`, `lib/hygraph.ts` | S |
| 8 | **Style system cleanup** | UX-15, CQ-06, rest of CQ-09 | `styles/_tokens.scss`, `_buttons.scss`, `_contact.scss`, `_carousel.scss`, `_interests.scss`, `_projects.scss`, `_modal.scss`, `_lightbox.scss` | M |
| 9 | **Content as data** | CQ-07, CQ-08, CQ-13, UX-14 (interests), GAP-03, GAP-04, GAP-08 | `components/Experience.tsx`, `Hero.tsx`, `Interests.tsx`, `Contact.tsx`, new `lib/profile.ts`, `lib/experience.ts`, `app/page.tsx` | M |
| 10 | **Tooling** | CQ-02, `strict: true` from CQ-03 | `tsconfig.json`, new ESLint, Vitest, and Playwright configs, `.github/workflows/ci.yml` | L |

Batch 10 can start at any point. Landing lint and a Playwright smoke test before batches 2–4 would give those refactors a safety net.

---

## 4. Open questions

1. **A test email may have been sent. I'm sorry about that.** While probing the contact API, I sent one request that passes validation (name "A", email `a,b,c@x.y`, message "hi") with a 1 ms client timeout, intending it to abort before reaching the server. I can't confirm that it did. If an email with the subject "Portfolio contact from A" arrived at your `CONTACT_TO` address, it came from this audit and can be deleted. No other request that passes validation was sent.
2. **Where is the site deployed, and on which domain?** I assumed Vercel, because `@vercel/analytics` and `@vercel/speed-insights` are installed and both 404 locally as expected. GAP-01 (`metadataBase`, OG URLs) and GAP-07 (sitemap) need the canonical domain.
3. **Cross-browser coverage.** I could only run Chromium, at emulated phone, tablet, and desktop sizes. I assumed Safari and Firefox behave the same except where noted under Cross-browser notes. Do you have real iOS and Android devices to spot-check the modal scroll lock and the Interests carousel, or should batch 10 add a Playwright WebKit and Firefox run?
4. **Case-study URLs (UX-03 / GAP-05).** Would you prefer a hash (`/#project-unpawse`, simplest, stays on one page), a query (`/?project=unpawse`), or real routes (`/projects/unpawse` with an intercepting route for the modal, better for SEO and OG images per project, and more work)?
5. **CMS outage behavior (UX-23).** Is it acceptable to rethrow Hygraph errors at runtime so ISR keeps serving the last good page? That means a cold start during an outage would 500 instead of degrading. I assumed you prefer "stale but complete" over "fresh but degraded".
6. **Spam protection appetite (UX-05).** Are you open to a third-party check such as Cloudflare Turnstile, and to a small KV store for rate limiting? Or should the fix stay dependency-free (honeypot, timing check, and length caps)?
7. **Publishing an email address (GAP-03).** Do you want a visible email or `mailto:` link in the Contact section, or is keeping the address private the reason the form exists?
8. **Content choices (GAP-08).** Are these intentional?
   - The skills list omits C#, Kotlin, and XAML while listing Java and MongoDB.
   - The degree is the first entry under "Work".
   - GPA appears twice.
   - The "About" nav label points at the hero.

   I didn't treat these as defects, just as things to confirm.
9. **Hygraph schema changes.** UX-13 (alt text) is best fixed with an `alt` or `caption` field on assets. Your notes mention a future `Project` model. Should content fixes wait for that migration, or should they go into `lib/*.ts` now?
10. **Test scope (CQ-02).** How much testing do you want to maintain? My suggested minimum is Vitest for `lib/content.ts` plus a single Playwright smoke file.
11. **The `.next` directory was rebuilt** by my `next build` run, which overwrote any previous local build output. It's gitignored and nothing tracked changed, but I'm mentioning it in case you were relying on an existing local build.

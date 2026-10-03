"use client";

import "../styles/main.scss";
import { FONT_VARIABLES } from "./fonts";
import { SITE_NAME } from "../lib/site";
import { THEME_INIT_SCRIPT } from "../lib/theme";

/** Replaces the root layout when the layout itself fails, so it brings its own shell. */
export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en" className={FONT_VARIABLES} suppressHydrationWarning>
      <head>
        <title>{`Something went wrong | ${SITE_NAME}`}</title>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <main className="status-page section-pad">
          <div className="container">
            <span className="label-cap">Error</span>
            <h1 className="h2">Something went wrong</h1>
            <p>The site hit an unexpected error. Trying again usually fixes it.</p>
            <div className="status-page-actions">
              <button type="button" className="btn-primary" onClick={retry}>
                Try again
              </button>
              {/* A full reload, since the root layout itself failed. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="btn-outline">
                Back to home
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}

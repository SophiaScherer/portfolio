"use client";

import "../styles/main.scss";

/** Replaces the root layout when the layout itself fails, so it brings its own shell. */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main className="status-page section-pad">
          <div className="container">
            <span className="label-cap">Error</span>
            <h1 className="h2">Something went wrong</h1>
            <p>The site hit an unexpected error. Trying again usually fixes it.</p>
            <div className="status-page-actions">
              <button type="button" className="btn-primary" onClick={reset}>
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

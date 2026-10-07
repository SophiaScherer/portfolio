"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" tabIndex={-1} className="status-page section-pad">
      <div className="container">
        <span className="label-cap">Error</span>
        <h1 className="h2">Something went wrong</h1>
        <p>This page hit an unexpected error. Trying again usually fixes it.</p>
        <div className="status-page-actions">
          <button type="button" className="btn-primary" onClick={retry}>
            Try again
          </button>
          <Link href="/" className="btn-outline">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

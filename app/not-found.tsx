import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "../lib/site";

export const metadata: Metadata = {
  title: `Page not found | ${SITE_NAME}`,
};

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="status-page section-pad">
      <div className="container">
        <span className="label-cap">404</span>
        <h1 className="h2">This page doesn&apos;t exist</h1>
        <p>The link may be out of date, or the address may have a typo.</p>
        <Link href="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    </main>
  );
}

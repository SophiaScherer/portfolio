import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "../styles/main.scss";
import { FONT_VARIABLES } from "./fonts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RevealObserver from "../components/RevealObserver";
import { getResumeDownload } from "../lib/content";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "../lib/site";
import { THEME_INIT_SCRIPT } from "../lib/theme";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  keywords: [
      "portfolio",
      "C++",
      "C++ developer",
      "C",
      "JavaScript",
      "CUDA",
      "OpenCL",
      "Data visualization",
      "Web development",
  ]
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f4e8" },
    { media: "(prefers-color-scheme: dark)", color: "#18181a" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const resume = await getResumeDownload();

  // The head script sets `data-theme` and `data-js` before hydration, hence
  // `suppressHydrationWarning`.
  return (
    <html
      lang="en"
      className={FONT_VARIABLES}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="ambient" aria-hidden="true">
          <div className="ambient-blob ambient-blob-1" />
        </div>

        <Navbar resume={resume} />

        {children}

        <Footer />
        <RevealObserver />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

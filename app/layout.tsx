import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "../styles/main.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getResumeDownload } from "../lib/content";
import { MATERIAL_SYMBOLS_HREF } from "../lib/icons";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/next';

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  weight: ["400", "700", "800", "900"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600"],
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["600"],
});

export const metadata: Metadata = {
  title: "Sophia Scherer | Portfolio",
  description:
    "Honors B.S. Computer Science student at Oregon State University specializing in high-performance computing, visualization, and full-stack development.",
  keywords: [
      "portfolio",
      "C++",
      "C++ developer",
      "C",
      "Javascript",
      "CUDA",
      "OpenCL",
      "Data visualization",
      "Web development",
  ]
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const resume = await getResumeDownload();

  return (
    <html
      lang="en"
      data-theme="light"
      className={`${epilogue.variable} ${jakarta.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      {/* Text fonts are self-hosted by next/font above; only the icon font
          still comes from Google. */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link href={MATERIAL_SYMBOLS_HREF} rel="stylesheet" />
      </head>
      <body>
        <div className="ambient" aria-hidden="true">
          <div className="ambient-blob ambient-blob-1" />
        </div>

        <Navbar resume={resume} />

        {children}

        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

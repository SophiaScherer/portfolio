import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "../styles/main.scss";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getResumeDownload } from "../lib/content";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,400;0,700;0,800;0,900;1,800;1,900&family=Plus+Jakarta+Sans:wght@400;500;600&family=Space+Grotesk:wght@600&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="ambient" aria-hidden="true">
          <div className="ambient-blob ambient-blob-1" />
          <div className="ambient-blob ambient-blob-2" />
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

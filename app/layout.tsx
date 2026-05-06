import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Epilogue, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
  title: "Sophia Scherer · Portfolio",
  description:
    "Honors B.S. Computer Science student at Oregon State University specializing in high-performance computing and visualization.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
      />
    </head>
    <body
        className={`${epilogue.variable} ${jakarta.variable} ${grotesk.variable} font-jakarta`}
    >
    <div className="ambient" aria-hidden="true">
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
    </div>

    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      <main className="w-full max-w-6xl px-6">
        {children}
      </main>

      <Footer />
    </div>
    </body>
    </html>
  );
}

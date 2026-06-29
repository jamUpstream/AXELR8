import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AXELR8 | Business Automation",
  description:
    "Precision-engineered automation systems. We build high-performance workflows designed to run faster, cleaner, and exactly how your business needs.",
  openGraph: {
    title: "AXLER8 | Aerospace-Grade Automation",
    description:
      "Precision-engineered automation systems for high-stakes scalability.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${GeistMono.variable}`}>
      <body className="font-inter text-body-md text-on-surface bg-background overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit, Caveat } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "@/components/site/CookieBanner";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

// Handwritten script for the gift-reveal love letter's personal note + signature.
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "my fav is tay 💌",
  description:
    "Travel through Taylor Swift's musical universe — every era its own world. Hand-pick songs and gift them with a personal note. An unofficial, non-commercial fan project.",
  openGraph: {
    title: "my fav is tay 💌",
    description: "Hand-picked Taylor Swift songs, wrapped up as a gift.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6c8dd",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${outfit.variable} ${caveat.variable}`}>
      {/* EraWorld is rendered by each page (not here) so it shares one
          module graph — and one era store — with the page's controls. */}
      <body className="min-h-screen antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

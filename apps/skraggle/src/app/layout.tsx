import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skraggle - Play Online for Free!",
  keywords:
    "video game, game, online, multiplayer, words, action, tabletop, party",
  description:
    "Make your own rules! Skraggle is a free online multiplayer turn-based strategy game. Construct words, collect loot, and destroy your enemies!",
  authors: [{ name: "Andrew Cao" }],
  twitter: {
    images: [
      {
        url: "https://skraggle.netlify.app/Site-Screenshot.png",
        width: 2300,
        height: 1293,
        alt: "screenshot of the Skraggle",
      },
    ],
    card: "summary_large_image",
    title: "Skraggle - Play Online for Free!",
    description:
      "Make your own rules! Skraggle is a free online multiplayer turn-based strategy game. Construct words, collect loot, and destroy your enemies!",
  },
  openGraph: {
    images: [
      {
        url: "https://skraggle.netlify.app/Site-Screenshot.png",
        width: 2300,
        height: 1293,
        alt: "screenshot of the Skraggle",
      },
    ],
    title: "Skraggle - Play Online for Free!",
    description:
      "Make your own rules! Skraggle is a free online multiplayer turn-based strategy game. Construct words, collect loot, and destroy your enemies!",
    url: "https://skraggle.netlify.app/",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ReduxProvider>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </ReduxProvider>
    </html>
  );
}

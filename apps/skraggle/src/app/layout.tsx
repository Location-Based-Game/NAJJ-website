import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skraggl.io - Play Online for Free!",
  keywords:
    "video game, game, online, multiplayer, words, action, tabletop, party",
  description:
    "Make your own rules! Skraggl.io is a free online multiplayer turn-based strategy game. Construct words, collect loot, and destroy your enemies!",
  authors: [{ name: "Andrew Cao" }],
  twitter: {
    images: [
      {
        url: "https://skraggle.netlify.app/Site-Screenshot.png",
        width: 2300,
        height: 1293,
        alt: "screenshot of the Skraggl.io",
      },
    ],
    card: "summary_large_image",
    title: "Skraggl.io - Play Online for Free!",
    description:
      "Make your own rules! Skraggl.io is a free online multiplayer turn-based strategy game. Construct words, collect loot, and destroy your enemies!",
  },
  openGraph: {
    images: [
      {
        url: "https://skraggle.netlify.app/Site-Screenshot.png",
        width: 2300,
        height: 1293,
        alt: "screenshot of the Skraggl.io",
      },
    ],
    title: "Skraggl.io - Play Online for Free!",
    description:
      "Make your own rules! Skraggl.io is a free online multiplayer turn-based strategy game. Construct words, collect loot, and destroy your enemies!",
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
        <TooltipProvider>
          <body className={inter.className}>
            {children}
            <Toaster />
          </body>
        </TooltipProvider>
      </ReduxProvider>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bitcoin Art Gallery",
  description: "Create, collect, and trade digital art NFTs on Bitcoin",
  keywords: ["Bitcoin", "Art", "NFT", "Gallery", "Digital Art", "Blockchain", "Crypto Art"],
  authors: [{ name: "Bitcoin Art Gallery" }],
  creator: "Bitcoin Art Gallery",
  publisher: "Bitcoin Art Gallery",
  openGraph: {
    title: "Bitcoin Art Gallery",
    description: "Create, collect, and trade digital art NFTs on Bitcoin",
    type: "website",
    locale: "en_US",
    siteName: "Bitcoin Art Gallery",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bitcoin Art Gallery - Create & Trade Art NFTs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitcoin Art Gallery",
    description: "Create, collect, and trade digital art NFTs on Bitcoin",
    images: ["/twitter-image.png"],
    creator: "@bitcoinart",
  },
  icons: {
    icon: "/bitcoin-art.jpg",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
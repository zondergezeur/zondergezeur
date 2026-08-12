import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zondergezeur.nl"),
  title: "Zonder Gezeur | Websites bouwen zonder gedoe",
  description:
    "Frisse, snelle websites voor ondernemers, verenigingen en projecten. Helder geregeld van eerste idee tot livegang.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon-32.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Zonder Gezeur",
    description: "Een mooie website zonder eindeloos gedoe.",
    type: "website",
    locale: "nl_NL",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Zonder Gezeur - Websites bouwen zonder gedoe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zonder Gezeur",
    description: "Websites bouwen zonder gedoe.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

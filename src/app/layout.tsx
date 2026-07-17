import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { getSiteSettings } from "@/lib/site-settings";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: {
      default: `${settings.site_title} — ${settings.site_tagline}`,
      template: `%s — ${settings.site_title}`,
    },
    description: settings.site_description,
    icons: settings.site_favicon ? { icon: settings.site_favicon } : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

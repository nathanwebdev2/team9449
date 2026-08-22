import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { buildSportsTeamJsonLd } from "@/lib/json-ld";
import { ROOT_DESCRIPTION_DRAFT } from "@/lib/metadata";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "9449 Yellowjackets",
    template: "%s | 9449 Yellowjackets",
  },
  description: ROOT_DESCRIPTION_DRAFT,
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const sportsTeamJsonLd = buildSportsTeamJsonLd();

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsTeamJsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-skiplink focus:rounded-sm focus:bg-jacket-500 focus:px-4 focus:py-2 focus:text-ink-900"
        >
          Skip to content
        </a>
        <Nav />
        <div id="site-content" className="flex flex-1 flex-col">
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

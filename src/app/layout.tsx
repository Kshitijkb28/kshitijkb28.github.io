import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { allSkills, links, profile, SITE } from "@/data/resume";
import { Providers } from "@/components/providers/Providers";
import { TopNav } from "@/components/nav/TopNav";
import { TabBar } from "@/components/nav/TabBar";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { Toast } from "@/components/ui/Toast";
import { Grain } from "@/components/ui/Grain";
import { Cursor } from "@/components/ui/Cursor";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: "variable",
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-instrument",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: profile.name, url: links.site.href }],
  creator: profile.name,
  keywords: [profile.name, profile.role, profile.city, ...allSkills],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: SITE.title, description: SITE.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneHref.replace("tel:", ""),
  url: SITE.url,
  address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: "IN" },
  sameAs: [links.github.href, links.linkedin.href, links.site.href],
  worksFor: { "@type": "Organization", name: profile.now.company, url: profile.now.href },
  knowsAbout: allSkills,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body>
        {/* Marks JS as available before first paint so the hero headline lines start clipped; the reveal itself is
            pure CSS, triggered by a second inline script right after the <h1> once its font is in (450 ms cap).
            Skipped under reduced motion; a CSS safety timer un-clips the lines if the trigger never fires. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-js','pending')}}catch(e){}",
          }}
        />
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <Providers>
          <ScrollProgress />
          <TopNav />
          {children}
          <TabBar />
          <Toast />
          <Cursor />
          <Grain />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      </body>
    </html>
  );
}

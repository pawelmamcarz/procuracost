import type { Metadata } from "next";
import { IBM_Plex_Mono, Public_Sans } from "next/font/google";
import "../globals.css";
import AppShell from "@/components/AppShell";
import { siteMetadataT } from "@/lib/i18n";
import { SITE_URL } from "../seo-config";

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...siteMetadataT.en.root,
  openGraph: {
    ...siteMetadataT.en.root,
    url: "/en",
    siteName: "ProcuraCost",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    ...siteMetadataT.en.root,
  },
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AppShell lang="en">{children}</AppShell>
      </body>
    </html>
  );
}

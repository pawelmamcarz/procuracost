import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";
import { SITE_URL } from "./seo-config";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

const title = "ProcuraCost — Kalkulator kosztów procedur zakupowych";
const description =
  "Porównaj formalną i adaptacyjną ścieżkę zakupu z jawnym zakresem niepewności modelu 2.0.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "ProcuraCost",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

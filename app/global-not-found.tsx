import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import SystemPage from "@/components/SystemPage";
import { systemPageT } from "@/lib/i18n";
import "./globals.css";

const publicSans = Public_Sans({ variable: "--font-public-sans", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  title: `${systemPageT.pl.notFoundTitle} / ${systemPageT.en.notFoundTitle} | ProcuraCost`,
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  return (
    <html lang="pl" className={publicSans.variable}>
      <body className="font-sans antialiased">
        <main>
          <SystemPage lang="pl" />
          <SystemPage lang="en" />
        </main>
      </body>
    </html>
  );
}

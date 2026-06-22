import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProcuraCost — Kalkulator kosztów procedur zakupowych",
  description:
    "Oblicz koszty utracone przywiązania do procedur przetargowych versus elastycznej polityki zakupowej.",
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

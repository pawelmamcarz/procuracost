import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
        <nav className="border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="text-lg font-bold text-blue-700">
              ProcuraCost
            </Link>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/calculator" className="hover:text-blue-600">
                Kalkulator
              </Link>
              <Link href="/optimizer" className="font-medium text-blue-600 hover:text-blue-700">
                Optymalizator RF
              </Link>
              <Link href="/case-studies" className="hover:text-blue-600">
                Case studies
              </Link>
              <Link href="/methodology" className="hover:text-blue-600">
                Methodology (EN)
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 bg-white px-6 py-4 text-center text-xs text-gray-400">
          ProcuraCost · Model oparty na badaniach akademickich ·{" "}
          <Link href="/methodology" className="underline hover:text-blue-500">
            Źródła i metodologia
          </Link>
        </footer>
      </body>
    </html>
  );
}

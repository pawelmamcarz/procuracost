import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { VERSION } from "@/lib/version";

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
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/calculator" className="hover:text-blue-600">
                Kalkulator
              </Link>
              <Link href="/optimizer" className="font-medium text-blue-600 hover:text-blue-700">
                Optymalizator RF
              </Link>
              <Link href="/case-studies" className="hover:text-blue-600">
                Case studies
              </Link>
              <Link href="/assessment" className="hover:text-blue-600">
                Ocena dojrzałości
              </Link>
              <Link href="/research" className="hover:text-blue-600">
                Research paper
              </Link>
              <Link href="/methodology" className="hover:text-blue-600">
                Methodology
              </Link>
              <Link href="/shortcasty" className="hover:text-blue-600">
                Shortcasty
              </Link>
              <Link href="/team" className="hover:text-blue-600">
                Zespół
              </Link>
              <Link
                href="/en"
                className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600"
              >
                EN
              </Link>
            </div>
          </div>
        </nav>
        <main className="flex-1">{children}</main>

        {/* Projects bar */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-5 sm:flex-row sm:justify-between">
            {/* Team */}
            <Link
              href="/team"
              className="flex items-center gap-3 opacity-80 hover:opacity-100"
            >
              <div className="flex -space-x-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Paweł Mamcarz" className="h-7 w-7 rounded-full object-cover ring-2 ring-white" />
                {[
                  { initials: "MK", color: "bg-indigo-100 text-indigo-700" },
                  { initials: "MB", color: "bg-teal-100 text-teal-700" },
                  { initials: "TS", color: "bg-amber-100 text-amber-700" },
                  { initials: "RM", color: "bg-red-100 text-red-700" },
                ].map(({ initials, color }) => (
                  <div
                    key={initials}
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white ${color}`}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">Zakupowy kolektyw</span>
            </Link>

            {/* Other projects */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span className="mr-2 hidden sm:inline">Inne projekty:</span>
              {[
                {
                  href: "https://silence-tax.com",
                  label: "Silence Tax",
                  desc: "Kalkulator podatku od milczenia",
                  color: "bg-orange-50 text-orange-700 border-orange-200",
                },
                {
                  href: "https://czympojade.pl",
                  label: "CzymPojade.pl",
                  desc: "Kalkulator TCO samochodu",
                  color: "bg-blue-50 text-blue-700 border-blue-200",
                },
                {
                  href: "https://przypominamy.com",
                  label: "Przypominamy.com",
                  desc: "Platforma przypomnień",
                  color: "bg-purple-50 text-purple-700 border-purple-200",
                },
                {
                  href: "https://akrobacja.com",
                  label: "Akrobacja.com",
                  desc: "akrobacja.com",
                  color: "bg-teal-50 text-teal-700 border-teal-200",
                },
                {
                  href: "https://www.linkedin.com/in/pawelmamcarz/",
                  label: "LinkedIn",
                  desc: "Profil zawodowy",
                  color: "bg-gray-50 text-gray-600 border-gray-200",
                },
              ].map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={p.desc}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${p.color}`}
                >
                  {p.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <footer className="border-t border-gray-100 bg-white px-6 py-3 text-center text-xs text-gray-400">
          ProcuraCost{" "}
          <span className="font-mono text-gray-300">{VERSION}</span>
          {" · "}Model oparty na badaniach akademickich ·{" "}
          <Link href="/methodology" className="underline hover:text-blue-500">
            Źródła i metodologia
          </Link>
        </footer>
      </body>
    </html>
  );
}

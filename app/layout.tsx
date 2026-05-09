import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavBar from "@/components/NavBar";
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
        <NavBar
          brand={{ href: "/", label: "ProcuraCost" }}
          items={[
            { href: "/calculator", label: "Kalkulator" },
            { href: "/optimizer", label: "Optymalizator RF", highlight: true },
            { href: "/case-studies", label: "Case studies" },
            { href: "/assessment", label: "Ocena dojrzałości" },
            { href: "/research", label: "Research paper" },
            { href: "/methodology", label: "Methodology" },
          ]}
          langSwitch={{ href: "/en", label: "EN" }}
        />
        <main className="flex-1">{children}</main>

        {/* Projects bar */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-5 sm:flex-row sm:justify-between">
            {/* Logo + name */}
            <a
              href="https://mamcarz.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 opacity-80 hover:opacity-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Pawel Mamcarz"
                className="h-8 w-8 rounded-md object-cover"
              />
              <span className="text-sm font-medium text-gray-700">Pawel Mamcarz</span>
            </a>

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

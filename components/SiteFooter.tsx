/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { VERSION } from "@/lib/version";
import { teamT, type Lang } from "@/lib/i18n";

const projects = [
  {
    href: "https://silence-tax.com",
    label: "Silence Tax",
    desc: "Kalkulator podatku od milczenia",
  },
  {
    href: "https://czympojade.pl",
    label: "CzymPojade.pl",
    desc: "Kalkulator TCO samochodu",
  },
  {
    href: "https://przypominamy.com",
    label: "Przypominamy.com",
    desc: "Platforma przypomnień",
  },
  {
    href: "https://akrobacja.com",
    label: "Akrobacja.com",
    desc: "akrobacja.com",
  },
  {
    href: "https://www.linkedin.com/in/pawelmamcarz/",
    label: "LinkedIn",
    desc: "Profil zawodowy",
  },
];

const teamAvatars = ["MK", "MB", "TS", "RM"];

export default function SiteFooter({ lang }: { lang: Lang }) {
  const isEnglish = lang === "en";
  const teamCopy = teamT[lang];

  return (
    <>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:justify-between">
          <Link
            href={isEnglish ? "/en/team" : "/team"}
            className="flex items-center gap-3 opacity-80 hover:opacity-100"
          >
            <div className="flex -space-x-2">
              <img src="/logo.png" alt="Paweł Mamcarz" className="h-7 w-7 rounded-full object-cover ring-2 ring-white" />
              {teamAvatars.map((initials) => (
                <div
                  key={initials}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700 ring-2 ring-white"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {teamCopy.collectiveLabel}
            </span>
          </Link>

          <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5 text-xs text-gray-400 lg:justify-end">
            <span className="mr-1 hidden lg:inline">
              {isEnglish ? "Other projects:" : "Inne projekty:"}
            </span>
            {projects.map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                title={p.desc}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-700"
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
        {" · "}
        {isEnglish
          ? "Model informed by academic research; most parameters are declared assumptions"
          : "Model oparty na badaniach akademickich; większość parametrów to jawne założenia"}{" "}
        ·{" "}
        <Link href={isEnglish ? "/en/methodology" : "/methodology"} className="underline hover:text-blue-500">
          {isEnglish ? "Sources & methodology" : "Źródła i metodologia"}
        </Link>
      </footer>
    </>
  );
}

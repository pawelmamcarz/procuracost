import Image from "next/image";
import Link from "next/link";
import { VERSION } from "@/lib/version";
import { footerT, teamT, type FooterProjectKey, type Lang } from "@/lib/i18n";

const projects: readonly { href: string; label: string; descriptionKey: FooterProjectKey }[] = [
  {
    href: "https://silence-tax.com",
    label: "Silence Tax",
    descriptionKey: "silenceTax",
  },
  {
    href: "https://czympojade.pl",
    label: "CzymPojade.pl",
    descriptionKey: "carTco",
  },
  {
    href: "https://przypominamy.com",
    label: "Przypominamy.com",
    descriptionKey: "reminders",
  },
  {
    href: "https://akrobacja.com",
    label: "Akrobacja.com",
    descriptionKey: "aerobatics",
  },
  {
    href: "https://www.linkedin.com/in/pawelmamcarz/",
    label: "LinkedIn",
    descriptionKey: "linkedin",
  },
];

const teamAvatars = ["MK", "MB", "TS", "RM"];

export default function SiteFooter({ lang }: { lang: Lang }) {
  const isEnglish = lang === "en";
  const teamCopy = teamT[lang];
  const footerCopy = footerT[lang];

  return (
    <>
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:justify-between">
          <Link
            href={isEnglish ? "/en/team" : "/team"}
            className="flex items-center gap-3 opacity-80 hover:opacity-100"
          >
            <div className="flex -space-x-2">
              <Image
                src="/logo.png"
                width={28}
                height={28}
                alt="Paweł Mamcarz"
                className="h-7 w-7 rounded-full object-cover ring-2 ring-white"
              />
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
              {footerCopy.otherProjects}
            </span>
            {projects.map((p) => (
              <a
                key={p.href}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                title={footerCopy.projectTitles[p.descriptionKey]}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-700"
              >
                {p.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-100 bg-white px-6 py-5 text-xs text-gray-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="leading-5">
            <span className="font-semibold text-gray-700">ProcuraCost</span>{" "}
            <span className="font-mono text-gray-400">{VERSION}</span>
            <span aria-hidden="true"> · </span>
            {footerCopy.modelNote}
          </p>
          <nav
            aria-label={footerCopy.resourceNavigation}
            className="flex flex-wrap gap-x-5 gap-y-2"
          >
            <Link
              href={isEnglish ? "/en/methodology" : "/methodology"}
              className="underline decoration-gray-300 underline-offset-4 hover:text-blue-700"
            >
              {footerCopy.methodology}
            </Link>
            <Link
              href={isEnglish ? "/en/readiness" : "/readiness"}
              className="underline decoration-gray-300 underline-offset-4 hover:text-blue-700"
            >
              {footerCopy.readiness}
            </Link>
            <Link
              href={
                isEnglish
                  ? "/en/practice/procurement-beyond-8"
                  : "/practice/procurement-beyond-8"
              }
              className="underline decoration-gray-300 underline-offset-4 hover:text-blue-700"
            >
              {footerCopy.practice}
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}

import Link from "next/link";

import { teamT, type Lang, type TeamCompetency, type TeamRole } from "@/lib/i18n";

type TeamMember = {
  name: string;
  initials: string;
  linkedin: string;
  roles: readonly TeamRole[];
};

const team: readonly TeamMember[] = [
  {
    name: "Paweł Mamcarz",
    initials: "PM",
    linkedin: "https://www.linkedin.com/in/pawelmamcarz/",
    roles: ["procurement", "analytics", "negotiation", "research"],
  },
  {
    name: "Mariusz Kościółek",
    initials: "MK",
    linkedin: "https://www.linkedin.com/in/mariuszkosciolek/",
    roles: ["sales", "implementation", "analytics"],
  },
  {
    name: "Marcin Bogucki",
    initials: "MB",
    linkedin: "https://www.linkedin.com/in/marcinbogucki/",
    roles: ["analytics", "procurement", "research"],
  },
  {
    name: "Tomasz Ślusarczyk",
    initials: "TS",
    linkedin: "https://www.linkedin.com/in/tomasz-ślusarczyk-806037141/",
    roles: ["implementation", "analytics"],
  },
  {
    name: "Rafał Madejewski",
    initials: "RM",
    linkedin: "https://www.linkedin.com/in/rafał-madejewski-a3713382/",
    roles: ["systems", "implementation"],
  },
];

const competencies = [
  "procurement",
  "analytics",
  "systems",
  "implementation",
  "negotiation",
  "research",
] as const satisfies readonly TeamCompetency[];

export default function TeamPage({ lang }: { lang: Lang }) {
  const t = teamT[lang];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-12 grid gap-5 border-y border-gray-300 py-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {t.title}
          </h1>
        </div>
        <p className="max-w-2xl self-end text-sm leading-6 text-gray-700">
          {t.description}
        </p>
      </header>

      <section
        aria-labelledby="team-people"
        className="mb-12"
        data-team-surface="directory"
      >
        <h2 id="team-people" className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {t.peopleTitle}
        </h2>
        <ul className="divide-y divide-gray-200 border-y border-gray-300">
          {team.map((member) => (
            <li key={member.name}>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid min-h-24 items-center gap-4 py-5 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto]"
              >
                <div
                  aria-hidden="true"
                  className="flex h-10 w-10 rotate-45 items-center justify-center border border-blue-500 bg-blue-50"
                >
                  <span className="-rotate-45 font-mono text-xs font-bold text-blue-800">
                    {member.initials}
                  </span>
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 group-hover:text-blue-700">
                    {member.name}
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                  {member.roles.map((role) => (
                    <li key={role} className="border-l border-gray-300 pl-2 first:border-l-0 first:pl-0">
                      {t.roles[role]}
                    </li>
                  ))}
                  </ul>
                </div>
                <span className="text-xs font-semibold text-blue-700 underline decoration-blue-200 underline-offset-4 group-hover:decoration-blue-700">
                  {t.linkedinLabel}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="team-competencies"
        data-team-surface="capability-register"
      >
        <h2 id="team-competencies" className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {t.competenciesTitle}
        </h2>
        <dl className="divide-y divide-gray-200 border-y border-gray-300">
          {competencies.map((competency, index) => (
            <div
              key={competency}
              className="grid gap-2 py-4 sm:grid-cols-[minmax(13rem,0.8fr)_minmax(0,1.2fr)] sm:items-baseline"
            >
              <dt className="grid grid-cols-[3rem_1fr] text-sm font-semibold text-gray-900">
                <span className="font-mono text-xs font-normal text-gray-400" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{t.competencies[competency].label}</span>
              </dt>
              <dd className="text-sm leading-6 text-gray-600">
                {t.competencies[competency].description}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="team-implementation"
        className="mt-12 grid gap-5 border-y border-gray-200 py-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-10"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
            {t.implementation.eyebrow}
          </p>
          <h2
            id="team-implementation"
            className="mt-2 text-xl font-semibold text-gray-900"
          >
            {t.implementation.title}
          </h2>
        </div>
        <div>
          <p className="text-sm leading-6 text-gray-600">
            {t.implementation.body}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-7 gap-y-2">
            <Link
              href={lang === "en" ? "/en/readiness" : "/readiness"}
              className="min-h-11 border-b border-blue-300 py-3 text-sm font-semibold text-blue-700 hover:border-blue-700"
            >
              {t.implementation.readinessAction}
            </Link>
            <Link
              href={
                lang === "en"
                  ? "/en/practice/procurement-beyond-8"
                  : "/practice/procurement-beyond-8"
              }
              className="min-h-11 border-b border-blue-300 py-3 text-sm font-semibold text-blue-700 hover:border-blue-700"
            >
              {t.implementation.practiceAction}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

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
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 rounded-xl border border-gray-100 bg-gray-50 p-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {t.eyebrow}
        </p>
        <h1 className="text-2xl font-bold leading-tight text-gray-900">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-700">{t.description}</p>
      </header>

      <section aria-labelledby="team-people" className="mb-10">
        <h2 id="team-people" className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {t.peopleTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <li key={member.name}>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-gray-100 bg-gray-50 p-5 transition-colors hover:border-gray-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-700">
                    {member.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{t.linkedinLabel}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1 text-xs text-gray-600">
                  {member.roles.map((role) => (
                    <li key={role}>{t.roles[role]}</li>
                  ))}
                </ul>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="team-competencies">
        <h2 id="team-competencies" className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          {t.competenciesTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competencies.map((competency) => (
            <li key={competency} className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-900">
                {t.competencies[competency].label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                {t.competencies[competency].description}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export const metadata = {
  title: "Zespół — ProcuraCost",
  description:
    "Zakupowy kolektyw z doświadczeniem wdrożeniowym, biznesowym, kupieckim, systemowym, analitycznym i klienckim.",
};

const TEAM = [
  {
    name: "Paweł Mamcarz",
    initials: "PM",
    color: "bg-blue-100 text-blue-700",
    linkedin: "https://www.linkedin.com/in/pawelmamcarz/",
    roles: ["kupiec", "analityk", "negocjator", "badacz"],
  },
  {
    name: "Mariusz Kościółek",
    initials: "MK",
    color: "bg-indigo-100 text-indigo-700",
    linkedin: "https://www.linkedin.com/in/mariuszkosciolek/",
    roles: ["sprzedawca", "wdrożeniowiec", "analityk"],
  },
  {
    name: "Marcin Bogucki",
    initials: "MB",
    color: "bg-teal-100 text-teal-700",
    linkedin: "https://www.linkedin.com/in/marcinbogucki/",
    roles: ["analityk", "problem solver", "kupiec", "badacz"],
  },
  {
    name: "Tomasz Ślusarczyk",
    initials: "TS",
    color: "bg-amber-100 text-amber-700",
    linkedin: "https://www.linkedin.com/in/tomasz-ślusarczyk-806037141/",
    roles: ["wdrożeniowiec", "analityk"],
  },
  {
    name: "Rafał Madejewski",
    initials: "RM",
    color: "bg-red-100 text-red-700",
    linkedin: "https://www.linkedin.com/in/rafał-madejewski-a3713382/",
    roles: ["deep tech wizard", "wdrożeniowiec"],
  },
];

const EXPERTISE = [
  { label: "Wdrożeniowa", desc: "Od kontraktu do działającego systemu.", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { label: "Kupiecka", desc: "Negocjacje, sourcing, kategorie zakupowe.", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Analityczna", desc: "Dane i modele jako podstawa decyzji.", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Biznesowa", desc: "Sprzedaż, relacje, rozumienie potrzeb klienta.", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { label: "Systemowa", desc: "Architektura procesów, integracje, automatyzacja.", color: "bg-red-50 text-red-700 border-red-200" },
  { label: "Kliencka", desc: "Perspektywa organizacji kupującej i użytkownika.", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          Zakupowy kolektyw
        </p>
        <h1 className="text-2xl font-bold leading-tight">
          Pełne e2e kompletnego ekosystemu zakupowego
        </h1>
        <p className="mt-3 text-sm text-blue-100">
          Wdrożeniowe, biznesowe, kupieckie, systemowe, analityczne i klienckie.
          Każdy projekt zakupowy ma u nas kogoś, kto już to przechodził.
        </p>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member) => (
          <a
            key={member.name}
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-xl border border-gray-100 bg-gray-50 p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold ${member.color}`}
              >
                {member.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                  {member.name}
                </p>
                <p className="text-xs text-gray-400">LinkedIn ↗</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {member.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-600"
                >
                  {role}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Pokrycie kompetencyjne
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERTISE.map((e) => (
            <div
              key={e.label}
              className={`rounded-lg border p-3 ${e.color}`}
            >
              <p className="text-xs font-semibold">{e.label}</p>
              <p className="mt-0.5 text-xs opacity-80">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

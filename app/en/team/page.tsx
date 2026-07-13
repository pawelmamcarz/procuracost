export const metadata = {
  title: "Team — ProcuraCost",
  description:
    "A procurement collective with implementation, business, buying, systems, analytical, and client-facing experience.",
};

const TEAM = [
  {
    name: "Paweł Mamcarz",
    initials: "PM",
    color: "bg-blue-100 text-blue-700",
    linkedin: "https://www.linkedin.com/in/pawelmamcarz/",
    roles: ["buyer", "analyst", "negotiator", "researcher"],
  },
  {
    name: "Mariusz Kościółek",
    initials: "MK",
    color: "bg-indigo-100 text-indigo-700",
    linkedin: "https://www.linkedin.com/in/mariuszkosciolek/",
    roles: ["salesperson", "implementation specialist", "analyst"],
  },
  {
    name: "Marcin Bogucki",
    initials: "MB",
    color: "bg-teal-100 text-teal-700",
    linkedin: "https://www.linkedin.com/in/marcinbogucki/",
    roles: ["analyst", "problem solver", "buyer", "researcher"],
  },
  {
    name: "Tomasz Ślusarczyk",
    initials: "TS",
    color: "bg-amber-100 text-amber-700",
    linkedin: "https://www.linkedin.com/in/tomasz-ślusarczyk-806037141/",
    roles: ["implementation specialist", "analyst"],
  },
  {
    name: "Rafał Madejewski",
    initials: "RM",
    color: "bg-red-100 text-red-700",
    linkedin: "https://www.linkedin.com/in/rafał-madejewski-a3713382/",
    roles: ["deep tech wizard", "implementation specialist"],
  },
];

const EXPERTISE = [
  { label: "Implementation", desc: "From contract to working system.", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { label: "Procurement", desc: "Negotiation, sourcing, purchasing categories.", color: "bg-green-50 text-green-700 border-green-200" },
  { label: "Analytical", desc: "Data and models as the basis for decisions.", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Business", desc: "Sales, relationships, understanding client needs.", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { label: "Systems", desc: "Process architecture, integrations, automation.", color: "bg-red-50 text-red-700 border-red-200" },
  { label: "Client-facing", desc: "The perspective of the buying organization and its users.", color: "bg-amber-50 text-amber-700 border-amber-200" },
];

export default function TeamEnPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-200">
          Procurement Collective
        </p>
        <h1 className="text-2xl font-bold leading-tight">
          Full end-to-end coverage of the procurement ecosystem
        </h1>
        <p className="mt-3 text-sm text-blue-100">
          Implementation, business, procurement, systems, analytical, and client-facing.
          Every procurement project has someone on our team who has already been through it.
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
          Competency coverage
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

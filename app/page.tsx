import type { Metadata } from "next";
import Link from "next/link";
import PipeFieldDiagram from "@/components/PipeFieldDiagram";
import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";

export const metadata: Metadata = {
  title: "ProcuraCost — Kalkulator kosztów procedur zakupowych",
  description:
    "Model kosztów, optymalizator ścieżki i bezpłatny audyt dojrzałości zakupowej. Sprawdź, ile Twoja organizacja traci na sztywnych procedurach.",
};

const stats = [
  { value: "~6%", label: "premia faworyzacji przy nadmiernej dyskrecji (której unika konkurencyjny przetarg)", source: "Szucs, JEEA 2024" },
  { value: "+7.7–10.5pp", label: "wyższe ryzyko renegocjacji kontraktu (dane obserwacyjne)", source: "Beuve, Moszoro & Spiller, NBER 2021" },
  { value: "30%", label: "potencjalne oszczędności TCO przy elastyczności (pułap praktyków, wieloletni)", source: "heurystyka branżowa (nieprzypisana)" },
];

const howItWorks = [
  {
    step: "01",
    title: "Opisz swój zakup",
    body: "Wybierz scenariusz (Ryanair, Swiss Casinos, Zara…) lub wpisz własne dane: wartość kontraktu, typ procesu, zespół i stawki. Nie wymaga rejestracji.",
  },
  {
    step: "02",
    title: "Oblicz koszty ukryte",
    body: "Model oparty na literaturze i benchmarkach praktyków wylicza 7 wymiarów kosztów — czas kadry, opóźnienia, renegocjacje, ryzyko obejść — i porównuje tunel z polem.",
  },
  {
    step: "03",
    title: "Porównaj i działaj",
    body: "Wynik to scenariusze ilustracyjne (generowane przez model), rekomendacja ścieżki zakupowej (model regułowy z analizą wrażliwości) i raport PDF z cytowaniami akademickimi.",
  },
];

const team = [
  {
    name: "Paweł Mamcarz",
    role: "Autor modelu / ProcureTech",
    initials: "PM",
    color: "bg-blue-600",
    url: "https://mamcarz.com",
  },
  {
    name: "Tomasz Ślusarczyk",
    role: "Ekspert zakupowy",
    initials: "TŚ",
    color: "bg-indigo-600",
    url: null,
  },
  {
    name: "Rafał Madejewski",
    role: "Analityk i badacz",
    initials: "RM",
    color: "bg-teal-600",
    url: null,
  },
];

const caseStudyPreviews = SCENARIOS.filter((s) => s.caseStudy)
  .slice(0, 3)
  .map((s) => {
    const result = calculateCosts(s.inputs);
    const insight = s.caseStudy!.insight;
    return {
      title: s.caseStudy!.title,
      insight: insight.length > 120 ? insight.slice(0, 117) + "…" : insight,
      rigidDays: result.rigidDays,
      flexibleDays: result.flexibleDays,
      source: s.caseStudy!.source,
    };
  });

const principles = [
  {
    title: "Procedura ≠ Polityka",
    body: "Polityka zakupowa wyznacza ramy i zasady. Procedura to tylko jedna z wielu metod ich realizacji. Mylenie ich kosztuje organizacje miliony.",
  },
  {
    title: "Kupiec jako strateg",
    body: "Ścisłe procedury zwalniają kupca z myślenia — 'zrobiłem zgodnie z procedurą, jestem bezpieczny'. Polityka zakupowa wymaga refleksji i kreatywności.",
  },
  {
    title: "Koszty są mierzalne",
    body: "Każdy dzień opóźnienia, każda renegocjacja, każda utracona okazja ma cenę. Ten kalkulator pomaga ją zobaczyć.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Narzędzie badawczo-konsultingowe
        </span>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Twoje procedury to tunel.
          <br />
          Polityka zakupowa to pole.
        </h1>
        <p className="mt-2 text-sm italic text-blue-600">
          Tunel ma ściany. Pole ma horyzont.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          Model szacuje, że w wielu kontekstach koszty procedur sztywnych są{" "}
          <span className="font-semibold text-gray-700">istotnie wyższe</span> niż koszty polityki
          zakupowej — sprawdź swój przypadek.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/calculator"
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Uruchom kalkulator →
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            Bezpłatny audyt →
          </Link>
          <Link
            href="/optimizer"
            className="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            Optymalizator ścieżki →
          </Link>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm"
          >
            <p className="text-3xl font-bold text-blue-700">{s.value}</p>
            <p className="mt-1 text-xs text-gray-600">{s.label}</p>
            <p className="mt-2 text-xs text-gray-400">{s.source}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-6">
          Jak działa ProcuraCost
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {howItWorks.map((h) => (
            <div key={h.step} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <span className="text-2xl font-bold text-blue-100">{h.step}</span>
              <h3 className="mt-2 font-bold text-gray-900">{h.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{h.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {principles.map((p) => (
          <div
            key={p.title}
            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <h3 className="font-bold text-gray-900">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-5">
          Case studies — elastyczne zakupy w praktyce
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {caseStudyPreviews.map((cs) => (
            <div key={cs.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3">
              <p className="text-xs font-bold text-gray-900">{cs.title}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{cs.insight}</p>
              <div className="flex gap-2 flex-wrap">
                <span className="rounded-md bg-red-50 border border-red-200 px-2 py-1 text-xs text-red-700">
                  Tunel: {cs.rigidDays} dni
                </span>
                <span className="rounded-md bg-green-50 border border-green-200 px-2 py-1 text-xs text-green-700">
                  Pole: {cs.flexibleDays} dni
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Liczba dni to ilustracyjny wynik modelu dla zakupu tej wielkości, nie dane z cytowanego źródła.
              </p>
              <p className="text-xs text-gray-400">{cs.source}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-right">
          <Link href="/case-studies" className="text-xs text-blue-600 hover:underline">
            Zobacz wszystkie case studies →
          </Link>
        </div>
      </div>

      <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">Model tunelu i pola</h2>
        <p className="mt-1 text-sm text-blue-700">
          Ten sam zakup — ta sama wartość — dwa światy. Procedura blokuje jedną ścieżkę i wymusza obejścia. Polityka wyznacza granice i daje wolność wyboru.
        </p>
        <div className="mt-4">
          <PipeFieldDiagram lang="pl" />
        </div>
        <p className="mt-3 text-xs text-blue-600">
          Podstawa teoretyczna: Lipsky (1980) Street-Level Bureaucracy; Vaughan (1996) Challenger; Holmström &amp; Milgrom (1991) Multitask Principal-Agent
        </p>
      </div>

      <div className="mt-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-5">Zespół</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm flex items-center gap-4"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${member.color}`}
              >
                {member.initials}
              </span>
              <div>
                {member.url ? (
                  <a
                    href={member.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {member.name}
                  </a>
                ) : (
                  <p className="font-semibold text-gray-900">{member.name}</p>
                )}
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Sprawdź, ile traci Twoja organizacja</h2>
        <p className="mt-2 text-blue-100">
          Kalkulator kosztów, optymalizator ścieżki i bezpłatny audyt dojrzałości zakupowej —
          wszystko oparte na recenzowanych badaniach naukowych.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/calculator"
            className="rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
          >
            Uruchom kalkulator
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-white/40 bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20"
          >
            Bezpłatny audyt →
          </Link>
        </div>
      </div>
    </div>
  );
}

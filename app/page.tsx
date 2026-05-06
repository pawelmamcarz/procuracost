import Link from "next/link";
import PipeFieldDiagram from "@/components/PipeFieldDiagram";
import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";

const stats = [
  { value: "+2%", label: "wyższe ceny przy sztywnych procedurach", source: "Szucs, JEEA 2024" },
  { value: "+7.7%", label: "wyższe ryzyko renegocjacji kontraktu", source: "Beuve et al., NBER 2021" },
  { value: "42%", label: "dłuższy czas realizacji projektów", source: "World Bank, 2023" },
  { value: "30%", label: "potencjalne oszczędności TCO przy elastyczności", source: "ISM" },
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
      {/* Hero */}
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
          Narzędzie badawczo-konsultingowe
        </span>
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Twoje procedury to rura.
          <br />
          Polityka zakupowa to pole.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
          Empiryczny model oparty na recenzowanych badaniach pokazuje: koszty procedur sztywnych
          przewyższają koszty polityki zakupowej o{" "}
          <span className="font-semibold text-gray-700">100–400%</span>. Sprawdź, ile traci Twoja
          organizacja.
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
            Ocena dojrzałości →
          </Link>
          <Link
            href="/optimizer"
            className="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
          >
            Optymalizator ścieżki →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
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

      {/* Principles */}
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

      {/* Case Studies Preview */}
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
                  Rura: {cs.rigidDays} dni
                </span>
                <span className="rounded-md bg-green-50 border border-green-200 px-2 py-1 text-xs text-green-700">
                  Pole: {cs.flexibleDays} dni
                </span>
              </div>
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

      {/* Pipe vs Field */}
      <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <h2 className="font-bold text-blue-900">Model rury i pola</h2>
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

      {/* CTA */}
      <div className="mt-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Sprawdź swój scenariusz</h2>
        <p className="mt-2 text-blue-100">
          Wybierz predefiniowany scenariusz lub wprowadź własne dane. Wynik zawiera szczegółowe
          rozbicie kosztów i cytowania akademickie.
        </p>
        <Link
          href="/calculator"
          className="mt-6 inline-block rounded-xl bg-white px-8 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          Idź do kalkulatora
        </Link>
      </div>
    </div>
  );
}

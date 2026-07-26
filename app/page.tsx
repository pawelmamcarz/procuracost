import type { Metadata } from "next";
import Link from "next/link";
import PipeFieldDiagram from "@/components/PipeFieldDiagram";
import { SCENARIOS } from "@/lib/scenarios";
import { calculateCosts } from "@/lib/calculations";

export const metadata: Metadata = {
  title: "ProcuraCost — Kalkulator kosztów procedur zakupowych",
  description:
    "Neutralny model kosztów z zakresem niepewności, optymalizator ścieżki i samoocena dojrzałości zakupowej.",
};

const stats = [
  { value: "~6%", label: "wzrost ceny przy dyskrecji; estymata strukturalna, transfer z rynku węgierskiego", source: "Szucs, JEEA 2024" },
  { value: "0,077–0,105/rok", label: "przyrost częstości formalnych aneksów przy wzroście o 1 SD w każdej z 7 kategorii sztywności kontraktu", source: "Beuve et al., JLEO 2023, 2SLS/IV" },
  { value: "0–15%", label: "jawny stres-test puli TCO; scenariusz centralny wynosi zero", source: "założenie modelu 2.2" },
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
    body: "Model wylicza 7 wymiarów i pokazuje wynik centralny wraz z szerokim zakresem scenariuszy, który może wskazać przewagę dowolnej ścieżki.",
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
      // Full text. Truncating at 117 chars systematically severed the caveat, which is
      // always the second sentence — "This is a c…" instead of "…a claim reported by an
      // organisation promoting the method, not an independent study."
      insight,
      rigidDays: result.rigidDays,
      flexibleDays: result.flexibleDays,
      source: s.caseStudy!.source,
    };
  });

const principles = [
  {
    title: "Procedura ≠ Polityka",
    body: "Polityka wyznacza granice, a procedura porządkuje działania. Ich rozdzielenie pozwala porównywać dopuszczalne ścieżki bez zakładania wyniku.",
  },
  {
    title: "Kontrola i adaptacja",
    body: "Formalizacja może chronić konkurencję i audytowalność; adaptacja może ograniczać opóźnienia. Model pokazuje oba mechanizmy.",
  },
  {
    title: "Koszty są mierzalne",
    body: "Każdy dzień opóźnienia i każdy formalny aneks może mieć cenę. Kalkulator pokazuje składniki wyniku oraz próg, przy którym zmienia się rekomendacja.",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="text-center">
        <span className="inline-block rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
          Narzędzie badawczo-konsultingowe
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">
          Tunel czy pole?
          <br />
          To pytanie empiryczne.
        </h1>
        <p className="mt-3 text-sm font-medium italic text-blue-700 sm:text-base">
          Tunel ma ściany. Pole ma horyzont.
        </p>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
          Model sprawdza, kiedy koszt sekwencyjnej formalności przewyższa jej wartość kontrolną —
          <span className="font-semibold text-gray-700"> bez zakładania zwycięzcy z góry</span>.
        </p>
        <div className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Link
            href="/calculator"
            className="rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800"
          >
            Uruchom kalkulator →
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700"
          >
            Bezpłatna samoocena →
          </Link>
          <Link
            href="/optimizer"
            className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700"
          >
            Optymalizator ścieżki →
          </Link>
        </div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
          >
            <p className="text-3xl font-bold tracking-tight text-blue-700">{s.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.label}</p>
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
          Ten sam zakup i ta sama granica zgodności, lecz dwie dopuszczalne ścieżki. Model sprawdza, kiedy formalizacja chroni wartość, a kiedy kosztuje więcej niż adaptacja.
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
          Kalkulator kosztów, optymalizator ścieżki i bezpłatna samoocena dojrzałości zakupowej —
          z jawnym rozdzieleniem wyników badań od szerokich założeń scenariuszowych.
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
            Bezpłatna samoocena →
          </Link>
        </div>
      </div>
    </div>
  );
}

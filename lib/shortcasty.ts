import { MODEL_V2_METADATA } from "./model-v2/domain";

export type Episode = {
  number: number;
  slug: string;
  title: string;
  titleEn: string;
  dimension: string;
  dimensionEn: string;
  focus: string;
  focusEn: string;
  thesis: string;
  thesisEn: string;
  practiceNote: string;
  practiceNoteEn: string;
  source?: {
    href: string;
    label: string;
    labelEn: string;
  };
  youtubeId?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  publishedAt?: string;
};

// Planned source-bounded editorial set.
export const EPISODES: Episode[] = [
  {
    number: 1,
    slug: "co-porownuje-model-kosztowy",
    title: `ProcuraCost ${MODEL_V2_METADATA.modelVersion}: co porównuje model kosztowy?`,
    titleEn: `ProcuraCost ${MODEL_V2_METADATA.modelVersion}: what does the cost model compare?`,
    dimension: "Metodologia",
    dimensionEn: "Methodology",
    focus: "Kontrakt obliczeniowy",
    focusEn: "Calculation contract",
    thesis:
      "Projekt przebiegu procesu, konkurencja i konstrukcja umowy są odrębnymi wymiarami. Model nie zastępuje ich wspólnym wskaźnikiem ani etykietą technologii.",
    thesisEn:
      "Procurement workflow design, competition and contract design are separate dimensions. The model does not replace them with a composite index or technology label.",
    practiceNote:
      "Przed obliczeniem udokumentuj osobno mapy czynności, ekspozycję konkurencyjną i konstrukcję umowy.",
    practiceNoteEn:
      "Before calculation, document the activity maps, competition exposure and contract design separately.",
  },
  {
    number: 2,
    slug: "szucs-konkurencja-i-dyskrecja",
    title: "Badanie Szucsa: dyskrecja, konkurencja i cena",
    titleEn: "The Szucs study: discretion, competition and price",
    dimension: "Konkurencja i wybór wykonawcy",
    dimensionEn: "Competition and contractor selection",
    focus: "Przegląd źródła",
    focusEn: "Source review",
    thesis:
      "W badanym rynku węgierskim estymata strukturalna dla ceny wynosi około 6%, a dla mierzonej produktywności wybranego wykonawcy około -10%. Badanie dotyczy zamówień poniżej progu około 25 mln HUF. Model 2.3 wykorzystuje wyłącznie ograniczony transfer kanału cenowego jako jawny zakres stresowy.",
    thesisEn:
      "In the studied Hungarian market, the structural estimate is approximately 6 per cent for price and -10 per cent for the selected contractor's measured productivity. The study covers contracts below an approximately HUF 25 million threshold. Model 2.3 uses only a bounded transfer of the price channel as an explicit stress range.",
    practiceNote:
      "Ekspozycję konkurencyjną mierz niezależnie od projektu przebiegu procesu. Transfer wyniku poza badaną populację wymaga jawnego założenia.",
    practiceNoteEn:
      "Measure competition exposure independently of workflow design. Transfer beyond the studied population requires an explicit assumption.",
    source: {
      href: "https://doi.org/10.1093/jeea/jvad017",
      label: "Szucs (2024), publikacja źródłowa",
      labelEn: "Szucs (2024), primary publication",
    },
  },
  {
    number: 3,
    slug: "beuve-sztywnosc-kontraktu",
    title: "Badanie Beuve i współautorów: konstrukcja umowy a aneksy",
    titleEn: "The Beuve study: contract design and formal amendments",
    dimension: "Konstrukcja umowy i aneksy",
    dimensionEn: "Contract design and formal amendments",
    focus: "Przegląd źródła",
    focusEn: "Source review",
    thesis:
      "Estymacja 0,077–0,105 dotyczy dodatkowych formalnych aneksów na rok kontraktu przy wzroście sztywności o jedno odchylenie standardowe w sektorze francuskich parkingów. To częstość, nie prawdopodobieństwo zdarzenia ani efekt projektu przebiegu procesu. W modelu 2.3 nie wyznacza różnicy kosztu aneksów.",
    thesisEn:
      "The 0.077-0.105 estimate concerns additional formal amendments per contract-year for a one-standard-deviation increase in rigidity in French car-park contracts. It is a frequency, not an event probability or an effect of workflow design. It does not set the amendment-cost differential in model 2.3.",
    practiceNote:
      "Rejestruj konstrukcję klauzul niezależnie od liczby czynności, nakładu pracy i czasu postępowania.",
    practiceNoteEn:
      "Record clause design independently of activity count, role effort and procurement duration.",
    source: {
      href: "https://doi.org/10.1093/jleo/ewab039",
      label: "Beuve, Moszoro i Saussier (2023), publikacja źródłowa",
      labelEn: "Beuve, Moszoro and Saussier (2023), primary publication",
    },
  },
  {
    number: 4,
    slug: "jak-czytac-przedzial-scenariuszowy",
    title: "Jak interpretować zakres scenariuszowy?",
    titleEn: "How should the scenario range be interpreted?",
    dimension: "Zakres wyniku",
    dimensionEn: "Result range",
    focus: "Granica interpretacji",
    focusEn: "Interpretation boundary",
    thesis:
      "Zakres niski, centralny i wysoki jest testem deklarowanych założeń, a nie przedziałem ufności. Przecięcie zera oznacza zmianę kierunku różnicy w tym zakresie.",
    thesisEn:
      "The low, central and high range tests declared assumptions, not statistical confidence. Crossing zero means that the direction changes within that range.",
    practiceNote:
      "Interpretuj wynik centralny razem z czynnikami kosztowymi, zakresem zewnętrznym i lokalnym rejestrem założeń.",
    practiceNoteEn:
      "Interpret the central result together with cost drivers, the outer range and the local assumptions register.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find((episode) => episode.slug === slug);
}

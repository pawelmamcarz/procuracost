import { MODEL_VERSION } from "./version";

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
  recommendation: string;
  youtubeId?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  publishedAt?: string;
};

// Planned source-bounded editorial set.
export const EPISODES: Episode[] = [
  {
    number: 1,
    slug: "model-2-2-2-co-porownujemy",
    title: `ProcuraCost ${MODEL_VERSION}: co naprawdę porównujemy?`,
    titleEn: `ProcuraCost ${MODEL_VERSION}: what do we actually compare?`,
    dimension: "Metodologia",
    dimensionEn: "Methodology",
    focus: "Ustalenia metodologiczne",
    focusEn: "Methodological clarification",
    thesis:
      "Formalny workflow, konkurencja i sztywność kontraktu są odrębnymi mechanizmami. Nie wolno zastępować ich jednym indeksem sztywności.",
    thesisEn:
      "Formal workflow, competition, and contract rigidity are separate mechanisms. They must not be replaced with a single rigidity index.",
    recommendation:
      "Przed porównaniem ścieżek opisz osobno czas pracy, konkurencję i konstrukcję umowy.",
  },
  {
    number: 2,
    slug: "szucs-konkurencja-i-dyskrecja",
    title: "Szucs: ile kosztuje dyskrecja w wyborze wykonawcy?",
    titleEn: "Szucs: what does discretion cost in contractor selection?",
    dimension: "Konkurencja · Selekcja",
    dimensionEn: "Competition · Selection",
    focus: "Przegląd źródła",
    focusEn: "Source review",
    thesis:
      "W badanym rynku węgierskim dyskrecja zwiększała cenę o około 6% i prowadziła do wyboru wykonawców o około 10% niższej mierzonej produktywności (estymaty strukturalne). Efekt zidentyfikowano na zamówieniach poniżej progu ok. 25 mln HUF, więc transfer poza ten rynek wymaga ostrożności.",
    thesisEn:
      "In the studied Hungarian market, discretion raised price by about 6% and led to contractors with about 10% lower measured productivity (structural estimates). The effect was identified for contracts below approximately HUF 25 million, so transfer beyond that market requires caution.",
    recommendation:
      "Mierz efektywną konkurencję; nie utożsamiaj adaptacyjnej pracy z niekonkurencyjnym wyborem.",
  },
  {
    number: 3,
    slug: "beuve-sztywnosc-kontraktu",
    title: "Beuve: kontrakt to nie workflow",
    titleEn: "Beuve: a contract is not workflow",
    dimension: "Kontrakt · Formalne aneksy",
    dimensionEn: "Contract · Formal amendments",
    focus: "Przegląd źródła",
    focusEn: "Source review",
    thesis:
      "Estymacja 0,077–0,105 dotyczy dodatkowych formalnych aneksów na rok kontraktu przy wzroście sztywności o jedno odchylenie standardowe w sektorze francuskich parkingów. To częstość, nie prawdopodobieństwo zdarzenia ani efekt formalności workflow.",
    thesisEn:
      "The 0.077–0.105 estimate concerns additional formal amendments per contract-year for a one-standard-deviation increase in rigidity in French car-park contracts. It is a frequency, not an event probability or an effect of workflow formality.",
    recommendation:
      "Koduj klauzule kontraktowe osobno od liczby kroków i czasu postępowania.",
  },
  {
    number: 4,
    slug: "jak-czytac-przedzial-scenariuszowy",
    title: "Kiedy model nie wskazuje zwycięzcy?",
    titleEn: "When does the model not identify a winner?",
    dimension: "Niepewność",
    dimensionEn: "Uncertainty",
    focus: "Ustalenia metodologiczne",
    focusEn: "Methodological clarification",
    thesis:
      "Zakres low/central/high jest testem założeń, nie przedziałem ufności. Gdy przecina zero, model nie daje odpornej rekomendacji kosztowej.",
    thesisEn:
      "The low/central/high range tests assumptions, not confidence. When it crosses zero, the model does not provide a robust cost recommendation.",
    recommendation:
      "Decyzję opieraj na rozbiciu kosztów i danych lokalnych, a nie na samym wyniku centralnym.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find((episode) => episode.slug === slug);
}

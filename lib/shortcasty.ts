import { MODEL_VERSION } from "./version";

export type Episode = {
  number: number;
  slug: string;
  title: string;
  dimension: string;
  focus: string;
  thesis: string;
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
    dimension: "Metodologia",
    focus: "Ustalenia metodologiczne",
    thesis:
      "Formalny workflow, konkurencja i sztywność kontraktu są odrębnymi mechanizmami. Nie wolno zastępować ich jednym indeksem sztywności.",
    recommendation:
      "Przed porównaniem ścieżek opisz osobno czas pracy, konkurencję i konstrukcję umowy.",
  },
  {
    number: 2,
    slug: "szucs-konkurencja-i-dyskrecja",
    title: "Szucs: ile kosztuje dyskrecja w wyborze wykonawcy?",
    dimension: "Konkurencja · Selekcja",
    focus: "Przegląd źródła",
    thesis:
      "W badanym rynku węgierskim dyskrecja zwiększała cenę o około 6% i prowadziła do wyboru wykonawców o około 10% niższej mierzonej produktywności (estymaty strukturalne). Efekt zidentyfikowano na zamówieniach poniżej progu ok. 25 mln HUF, więc transfer poza ten rynek wymaga ostrożności.",
    recommendation:
      "Mierz efektywną konkurencję; nie utożsamiaj adaptacyjnej pracy z niekonkurencyjnym wyborem.",
  },
  {
    number: 3,
    slug: "beuve-sztywnosc-kontraktu",
    title: "Beuve: kontrakt to nie workflow",
    dimension: "Kontrakt · Formalne aneksy",
    focus: "Przegląd źródła",
    thesis:
      "Estymacja 0,077–0,105 dotyczy dodatkowych formalnych aneksów na rok kontraktu przy wzroście sztywności o jedno odchylenie standardowe w sektorze francuskich parkingów. To częstość, nie prawdopodobieństwo zdarzenia ani efekt formalności workflow.",
    recommendation:
      "Koduj klauzule kontraktowe osobno od liczby kroków i czasu postępowania.",
  },
  {
    number: 4,
    slug: "jak-czytac-przedzial-scenariuszowy",
    title: "Kiedy model nie wskazuje zwycięzcy?",
    dimension: "Niepewność",
    focus: "Ustalenia metodologiczne",
    thesis:
      "Zakres low/central/high jest testem założeń, nie przedziałem ufności. Gdy przecina zero, model nie daje odpornej rekomendacji kosztowej.",
    recommendation:
      "Decyzję opieraj na rozbiciu kosztów i danych lokalnych, a nie na samym wyniku centralnym.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find((episode) => episode.slug === slug);
}

export type Episode = {
  number: number;
  slug: string;
  title: string;
  dimension: string;
  guest: string;
  thesis: string;
  recommendation: string;
  youtubeId?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  publishedAt?: string;
};

// Model-2.1 editorial set. Only current, source-bounded claims belong here.
export const EPISODES: Episode[] = [
  {
    number: 1,
    slug: "model-2-1-co-sie-zmienilo",
    title: "ProcuraCost 2.1: co naprawdę porównujemy?",
    dimension: "Metodologia",
    guest: "Odcinek metodologiczny",
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
    guest: "Przegląd źródła",
    thesis:
      "W badanym rynku węgierskim dyskrecja zwiększała znormalizowaną cenę o około 6 pp i prowadziła do wyboru wykonawców o 28% niższej mierzonej produktywności. Transfer poza ten rynek wymaga ostrożności.",
    recommendation:
      "Mierz efektywną konkurencję; nie utożsamiaj adaptacyjnej pracy z niekonkurencyjnym wyborem.",
  },
  {
    number: 3,
    slug: "beuve-sztywnosc-kontraktu",
    title: "Beuve: kontrakt to nie workflow",
    dimension: "Kontrakt · Formalne aneksy",
    guest: "Przegląd źródła",
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
    guest: "Odcinek metodologiczny",
    thesis:
      "Zakres low/central/high jest testem założeń, nie przedziałem ufności. Gdy przecina zero, model nie daje odpornej rekomendacji kosztowej.",
    recommendation:
      "Decyzję opieraj na rozbiciu kosztów i danych lokalnych, a nie na samym wyniku centralnym.",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return EPISODES.find((episode) => episode.slug === slug);
}

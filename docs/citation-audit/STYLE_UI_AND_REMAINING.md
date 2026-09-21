# Korekta UI i pozostałych tekstów badawczych, 21 września 2026

Uzupełnia [`STYLE_REVIEW.md`](STYLE_REVIEW.md). Ten plik opisuje skrypt
stylu, korektę kopii interfejsu oraz pozostałe teksty badawcze poza
już poprawionymi publikacjami.

## Skrypt i Jev

Dodano `scripts/audit-style.mjs` oraz [`STYLE_AUDIT.md`](STYLE_AUDIT.md).
Jev tylko ocenia sekcje. Nie generuje nowej prozy. Pytania Noul:

- `stockRhetoric`;
- `redundancy`;
- `overclaim`;
- `aiStockVoice` (sygnał redakcyjny o generycznym głosie LLM, nie detektor
  autorstwa).

W tym środowisku nie było `TYPESAFE_API_KEY`. Uruchomiono wyłącznie tryb
lokalny: walidacja schematu i werdykt `not_evaluated`. Nie zapisano
fikcyjnych ocen modelu. Ponowny audyt na żywo:

```sh
node --env-file=.env.local scripts/audit-style.mjs \
  docs/citation-audit/style-ui-pass/sections.json --live
```

Wsadowo 34 sekcje (strona główna, metadane, kalkulator, rekord decyzji,
model, metodologia, gotowość, shortcasty, agenda, zespół, praktyka,
`PHD_ROADMAP.md` i pakiet dla promotora). Katalog
`style-ui-pass/` zawiera wejście. Wyników live nie ma, bo klucza nie było.

Sześć fixture'ów w `examples-style.json` służy do testów offline, nie do
pomiaru jakości redakcyjnej.

## Kopia interfejsu, którą zmieniono

Kryteria te same co w STYLE_REVIEW: mniej sloganów, mniej równoległych
puent, mniej pustej płynności. Zachowano słownictwo modelu
(`formalSequential` / `adaptiveCompliant`), tożsamość delty, terminy
prawne i testowane frazy, które nadal obowiązują.

| Klucze | Co zmieniono |
|---|---|
| `ogT` | krótsza linia PL; EN bez „transparent cost record” |
| `homeExperienceT.hero`, `.record` | konkretny zakup zamiast „podejść zgodnych z regulacjami”; wynik z założeniami zamiast „reproducible result” |
| `homeT.hero.description`, `.jobs`, `.evidenceRegister`, `.evidence`, `.implementation` | mniej kadencji „from X to Y” i „start with the decision” |
| `siteMetadataT.home` | krótszy opis PL; EN nazywa oba przebiegi osobno |
| `modelOverviewT.title`, `.intro`, `.reproducibility.title` | „Model, źródła i replikacja” zamiast „centrum” i „od hipotezy do wyniku” |
| `methodologyOverviewT.title`, `.intro` | jak liczymy różnicę, bez założonego znaku |
| `researchAgendaT.title`, `.intro` | „najpierw zmierz”, bez hasła walidacyjnego |
| `readinessT.subtitle` | samoopis przed wyborem i przed konfiguracją |
| `shortcastsT.intro` | krótsze zdanie o tym, czym wynik nie jest |
| `teamT` | kto za co odpowiada, bez „łączymy perspektywy” |
| `practiceT.subtitle` | obserwacje i zasady użycia, bez „structured review” |

Nie ruszano etykiet osi, stawek, klas dowodowych, tożsamości delty,
komunikatów walidacji kalkulatora ani pytań gotowości, poza podtytułem
strony. `lib/i18n.ts#researchPaperEn` pozostaje po STYLE_REVIEW.

## Teksty badawcze, które zmieniono

| Tekst | Korekta |
|---|---|
| `PHD_ROADMAP.md` | cel bez „defensible package”; mechanizm do zaobserwowania, nie etykieta; ocena na końcu horyzontu według dowodów |
| `docs/supervisor/README.md` | cel spotkania w jednym zdaniu wprowadzającym |
| `docs/supervisor/01-one-pager.md` | problem: mieszanie mechanizmów, nie „łączenie” jako ozdobnik |
| `docs/research/README.md` | pierwsza linia bez „intentionally small” jako ozdobnika |

Hipotezy H1a–H5 i propozycje P1a–P5, wzory, cytowania i liczby nie były
przedmiotem tej korekty.

## Celowo zostawione

- Siedem artykułów, `RESEARCH.md`, `00-shared-foundation.md` i publiczny
  skrót `/research`: już w STYLE_REVIEW. Nie wracano do nich.
- `docs/MODEL_PARAMETERS.md`: kontrakt parametrów, nie proza do
  humanizacji.
- `docs/research/EMPIRICAL_VALIDATION_PLAN.md` i
  `docs/research/model_specification_draft.md`: protokół i specyfikacja.
  Już konkretne; hipotez i wzorów nie ruszano.
- `docs/articles/procurement-beyond-8-brief.md`: brief roboczy, już
  operacyjny.
- `docs/supervisor/00-tozsamosc-formalna.md`, `02-meeting-agenda.md`,
  `03-decisions-needed.md`, `04-evidence-and-integrity-note.md`: już
  konkretne. `05-co-zmienilo-sie-po-recenzji.md` to historyczny list
  audytowy 2.2.2; myślniki w tym pliku zostawiono, bo tekst nie był
  przepisywany.
- Archiwum modelu 1.x i kwarantanna 2.2.2.
- `lib/model-v2/`: bez zmian ekonomii, wzorów, terminów prawnych,
  scenariuszy, neutralności i granic dowodowych.

Korekta jest redakcyjna. Nie jest detektorem autorstwa AI ani nowym
wynikiem empirycznym.

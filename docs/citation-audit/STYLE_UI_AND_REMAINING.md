# Korekta UI i pozostałych tekstów badawczych, 21–22 września 2026

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

Live ukończono 22 września 2026 poza tą maszyną wirtualną: `jev-1.13.0`,
34/34 ocenione, 0 błędów. Trzynaście sekcji miało noul ≥ 0,5. Pełny zrzut
odpowiedzi na sekcję pozostał poza VM; w repozytorium jest triage
[`style-ui-pass/live-triage.json`](style-ui-pass/live-triage.json).
Ocen nie wymyślano. `TYPESAFE_API_KEY` nadal nie było tutaj, więc
`live-results.json` nie zapisano. Lokalny przebieg z 21 września zostaje
w `local-dry-run.json` jako historyczny skip (schemat, `not_evaluated`).

`questionHash` live to
`e6d6f35f138909caea84def7810f98b09bf9c0005ab865c06224f335477ec6ab`.
W tym przebiegu `overclaim.instructions` zaczynało się od „Does section
present”. Skrypt ma już „Does this section present”; kolejny live hash
będzie inny. Hashu triage nie przepisano.

Próg 0,5 jest wygodą triage, nie progiem publikacji. Ponowny audyt:

```sh
node --env-file=.env.local scripts/audit-style.mjs \
  docs/citation-audit/style-ui-pass/sections.json --live
```

Wsadowo 34 sekcje (strona główna, metadane, kalkulator, rekord decyzji,
model, metodologia, gotowość, shortcasty, agenda, zespół, praktyka,
`PHD_ROADMAP.md` i pakiet dla promotora). `sections.json` ma teksty po
trzeciej lekkiej korekcie. `live-triage.json` zachowuje pierwszy przebieg;
`live-triage-pass2.json` zachowuje teksty ocenione po drugiej korekcie.

Sześć fixture'ów w `examples-style.json` służy do testów offline, nie do
pomiaru jakości redakcyjnej.

## Kopia interfejsu, którą zmieniono

Kryteria te same co w STYLE_REVIEW: mniej sloganów, mniej równoległych
puent, mniej pustej płynności. Zachowano słownictwo modelu
(`formalSequential` / `adaptiveCompliant`), tożsamość delty, terminy
prawne i testowane frazy, które nadal obowiązują.

| Klucze | Co zmieniono |
|---|---|
| `ogT` | druga korekta: „Porównanie dwóch zgodnych przebiegów…” / „A comparison of two lawful workflows…” |
| `homeExperienceT.hero`, `.record`, `.journey` | zakup i zapis zamiast sloganu; druga korekta: „Co jest w zapisie…” / „Four steps: case, workflows, costs, record” |
| `homeT.hero.description`, `.jobs`, `.evidenceRegister`, `.evidence`, `.implementation` | mniej kadencji „from X to Y” i „start with the decision” |
| `homeT.boundary` | trzecia korekta: dwa projekty pod jedną granicą; podpis bez „obie ścieżki pozostają” |
| `siteMetadataT.home` | krótszy opis PL z zachowanym „Wynik z założeniami”; EN nazywa oba przebiegi osobno |
| `modelOverviewT.title`, `.intro`, `.reproducibility.title` | „Model, źródła i replikacja” zamiast „centrum” i „od hipotezy do wyniku” |
| `methodologyOverviewT.title`, `.intro` | „Różnica kosztu bez założonego znaku” / „Cost difference with no assumed sign” |
| `researchAgendaT.title`, `.intro` | „najpierw zmierz”, bez hasła walidacyjnego |
| `readinessT.subtitle` | samoopis przed wyborem i przed konfiguracją |
| `shortcastsT.intro` | krótsze zdanie o tym, czym wynik nie jest |
| `teamT` | trzecia korekta EN: role for the model; lista obowiązków zostaje u właściciela procesu |
| `practiceT.subtitle` | druga korekta: indeks fragmentów odcinka 8; tytuł odcinka YouTube bez zmian |

Nie ruszano etykiet osi, stawek, klas dowodowych, tożsamości delty,
komunikatów walidacji kalkulatora ani pytań gotowości, poza podtytułem
strony. `lib/i18n.ts#researchPaperEn` pozostaje po STYLE_REVIEW.

## Teksty badawcze, które zmieniono

| Tekst | Korekta |
|---|---|
| `PHD_ROADMAP.md` | trzecia korekta celu: plik doktorski modelu 2.3.0 i zapis otwarty do audytu; bez trójdzielnej kadencji „prepare, keep, send” |
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

## Druga korekta, 22 września 2026

Po triage przepisano residualne teksty z noul ≥ 0,5. Znaczenie, pary PL/EN,
słownictwo `formalSequential` / `adaptiveCompliant` i brak myślników w prozie
zostały zachowane. Angielski pozostaje brytyjski. Tytuł odcinka YouTube
(`practiceT.title`) nie był ruszany.

Sygnały z `live-triage.json` (nie wymyślone):

| Id | Flagi ≥ 0,5 |
|---|---|
| `practice-pl` | stockRhetoric 0,75; overclaim 0,59 |
| `practice-en` | stockRhetoric 0,80; overclaim 0,66; aiStockVoice 0,58 |
| `home-boundary-pl` | aiStockVoice 0,79 |
| `home-boundary-en` | aiStockVoice 0,85 |
| `team-en` | aiStockVoice 0,69 |
| `og-pl` | aiStockVoice 0,65 |
| `og-en` | aiStockVoice 0,53 |
| `phd-roadmap-purpose` | aiStockVoice 0,78 |
| `home-record-pl` | aiStockVoice 0,58 |
| `home-journey-en` | aiStockVoice 0,54 |
| `metadata-home-pl` | aiStockVoice 0,50 |
| `methodology-intro-pl` | aiStockVoice 0,54 |
| `methodology-intro-en` | aiStockVoice 0,50 |

Korekta jest redakcyjna. Nie jest detektorem autorstwa AI ani nowym
wynikiem empirycznym.

## Ponowna ocena po drugiej korekcie, 22 września 2026

Live `jev-1.13.0` poza VM: 34/34, 0 błędów. Flag ≥ 0,5 spadło z 13 do 5.
Triage: [`live-triage-pass2.json`](style-ui-pass/live-triage-pass2.json).
Ocen nie wymyślano.

Zeszły poniżej 0,5: `practice-pl`, `practice-en`, `og-pl`, `og-en`,
`home-record-pl`, `home-journey-en`, `metadata-home-pl`,
`methodology-intro-pl`. `stockRhetoric` i `overclaim` nie wróciły.

Zostały wyłącznie `aiStockVoice`:

| Id | Flagi ≥ 0,5 |
|---|---|
| `home-boundary-pl` | 0,62 |
| `home-boundary-en` | 0,57 |
| `methodology-intro-en` | 0,52 |
| `team-en` | 0,56 |
| `phd-roadmap-purpose` | 0,80 |

Cel w `PHD_ROADMAP.md` nadal był wysoki (0,80). Przepisano go raz jeszcze,
lekko też `homeT.boundary` i `teamEn`. `methodology-intro-en` przy 0,52
zostawiono: próg 0,5 jest wygodą triage, a zdanie w triage cytuje jeszcze
pierwszą kadencję („How the difference is calculated…”); bieżąca kopia
strony już jest inna. Trzeciej oceny na żywo nie było.

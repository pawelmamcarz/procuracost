import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import * as i18n from "@/lib/i18n";
import ShortcastyEnPage from "@/app/(en)/en/shortcasty/page";
import ShortcastyPage from "@/app/(pl)/shortcasty/page";
import ShortcastEpisodePage from "@/app/(pl)/shortcasty/[slug]/page";
import ResearchAgendaPage from "@/app/(pl)/research-agenda/page";
import SiteFooter from "@/components/SiteFooter";
import TeamPage from "@/components/TeamPage";
import { PATHS } from "@/lib/optimizer";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { EPISODES } from "@/lib/shortcasty";
import { navigationFor } from "@/lib/site-routes";
import { APPROVED_PUBLIC_EM_DASH_LINES } from "./fixtures/approved-public-em-dashes";

const root = fileURLToPath(new URL("..", import.meta.url));

const currentPublicFiles = [
  "app/(pl)/layout.tsx",
  "app/(en)/layout.tsx",
  "app/(pl)/model/page.tsx",
  "app/(en)/en/model/page.tsx",
  "app/(pl)/model/assumptions/layout.tsx",
  "app/(en)/en/model/assumptions/layout.tsx",
  "app/(pl)/model/assumptions/page.tsx",
  "app/(en)/en/model/assumptions/page.tsx",
  "app/(pl)/assessment/page.tsx",
  "app/(en)/en/assessment/page.tsx",
  "app/(pl)/research-agenda/page.tsx",
  "app/(pl)/shortcasty/page.tsx",
  "app/(en)/en/shortcasty/page.tsx",
  "app/(pl)/shortcasty/[slug]/page.tsx",
  "app/(en)/en/case-studies/page.tsx",
  "app/icon.svg",
  "components/SiteFooter.tsx",
  "lib/i18n.ts",
  "lib/shortcasty.ts",
  "lib/scenarios.ts",
] as const;

const staleCurrentVersion = /\b(?:model 2\.1|modelu 2\.1|ProcuraCost 2\.1)\b/i;
const historicalModel22Context =
  /(?:przeniesion|historycz|scenariusz|założe|źródł|zachowan|retained|historical|scenario|assumption|source|previous)/i;
const forbiddenTeamPhrases = [
  "pełne e2e kompletnego",
  "procurement ecosystem",
  "deep tech wizard",
] as const;

async function readPublicFile(path: string) {
  return readFile(new URL(path, `file://${root}/`), "utf8");
}

interface PublicSource {
  path: string;
  content: string;
}

async function readCurrentPublicSources(): Promise<PublicSource[]> {
  const sources: PublicSource[] = [];

  async function visit(directory: string) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolutePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(absolutePath);
      } else if (entry.isFile()) {
        sources.push({
          path: relative(root, absolutePath),
          content: await readFile(absolutePath, "utf8"),
        });
      }
    }
  }

  for (const directory of ["app", "components", "lib"]) {
    await visit(join(root, directory));
  }

  return sources.sort((a, b) => a.path.localeCompare(b.path));
}

function maskRange(content: string, start: number, end: number) {
  const units = content.split("");
  for (let index = start; index < end; index += 1) {
    if (units[index] !== "\n" && units[index] !== "\r") units[index] = " ";
  }
  return units.join("");
}

function maskPattern(content: string, pattern: RegExp) {
  return content.replace(pattern, (match) => match.replace(/[^\r\n]/g, " "));
}

function withoutCodeComments(source: PublicSource) {
  if (source.path.endsWith(".css")) {
    return maskPattern(source.content, /\/\*[\s\S]*?\*\//g);
  }
  if (source.path.endsWith(".svg")) {
    return maskPattern(source.content, /<!--[\s\S]*?-->/g);
  }

  const sourceFile = ts.createSourceFile(
    source.path,
    source.content,
    ts.ScriptTarget.Latest,
    true,
    source.path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const commentRanges = new Map<string, ts.CommentRange>();

  function collectCommentRanges(node: ts.Node) {
    for (const range of ts.getLeadingCommentRanges(source.content, node.getFullStart()) ?? []) {
      commentRanges.set(`${range.pos}:${range.end}`, range);
    }
    for (const range of ts.getTrailingCommentRanges(source.content, node.getEnd()) ?? []) {
      commentRanges.set(`${range.pos}:${range.end}`, range);
    }
    node.forEachChild(collectCommentRanges);
  }

  collectCommentRanges(sourceFile);
  let masked = source.content;
  for (const range of commentRanges.values()) {
    masked = maskRange(masked, range.pos, range.end);
  }
  return masked;
}

function approvedEmDashLineCounts() {
  const counts = new Map<string, number>();
  for (const [path, lines] of Object.entries(APPROVED_PUBLIC_EM_DASH_LINES)) {
    for (const line of lines) {
      const key = `${path}\0${line}`;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function findUnapprovedEmDashes(sources: PublicSource[]) {
  const approved = approvedEmDashLineCounts();
  const violations: string[] = [];

  for (const source of sources) {
    withoutCodeComments(source).split(/\r?\n/).forEach((line, index) => {
      if (!line.includes("—")) return;
      const trimmedLine = line.trim();
      const key = `${source.path}\0${trimmedLine}`;
      const remaining = approved.get(key) ?? 0;
      if (remaining > 0) {
        approved.set(key, remaining - 1);
      } else {
        violations.push(`${source.path}:${index + 1}:${trimmedLine}`);
      }
    });
  }

  for (const [key, remaining] of approved) {
    if (remaining > 0) {
      const [path, line] = key.split("\0");
      violations.push(`unused approval (${remaining}):${path}:${line}`);
    }
  }

  return violations;
}

function assertNoUnapprovedEmDashes(sources: PublicSource[]) {
  const violations = findUnapprovedEmDashes(sources);
  if (violations.length > 0) {
    throw new Error(`Unapproved public em dash:\n${violations.join("\n")}`);
  }
}

describe("public editorial integrity", () => {
  it("keeps current public surfaces on the active model version", async () => {
    const currentFacingSources = (await readCurrentPublicSources()).filter((source) =>
      source.path.startsWith("app/")
      || source.path.startsWith("components/")
      || ["lib/i18n.ts", "lib/scenarios.ts", "lib/shortcasty.ts"].includes(source.path),
    );

    for (const source of currentFacingSources) {
      expect(source.content, source.path).not.toMatch(staleCurrentVersion);
    }
  });

  it("permits model 2.2.2 on public surfaces only as explicit provenance", async () => {
    const currentFacingSources = (await readCurrentPublicSources()).filter((source) =>
      source.path.startsWith("app/")
      || source.path.startsWith("components/")
      || ["lib/i18n.ts", "lib/scenarios.ts", "lib/shortcasty.ts"].includes(source.path),
    );

    for (const source of currentFacingSources) {
      withoutCodeComments(source).split(/\r?\n/).forEach((line, index) => {
        if (!line.includes("2.2.2")) return;
        expect(
          line,
          `${source.path}:${index + 1} must identify model 2.2.2 as historical provenance`,
        ).toMatch(historicalModel22Context);
      });
    }
  });

  it("does not advertise placeholder collection or distribution actions", async () => {
    for (const path of currentPublicFiles) {
      const content = await readPublicFile(path);
      expect(content, path).not.toContain("formspree.io/f/placeholder");
      expect(content, path).not.toMatch(/href:\s*["']#["']/);
    }
  });

  it("keeps the calculator action neutral in both languages", () => {
    expect(i18n.calculatorT.pl.calculate).toBe("Porównaj koszty");
    expect(i18n.calculatorT.en.calculate).toBe("Compare costs");
  });

  it("keeps the public decision-record dictionary paired, neutral and British-English", () => {
    function leafPaths(value: unknown, path = ""): string[] {
      if (typeof value === "string" || typeof value === "function") {
        return [path];
      }
      if (!value || typeof value !== "object") return [];
      return Object.entries(value).flatMap(([key, child]) =>
        leafPaths(child, path ? `${path}.${key}` : key)
      );
    }

    expect(leafPaths(i18n.decisionRecordT.pl).sort()).toEqual(
      leafPaths(i18n.decisionRecordT.en).sort()
    );
    const neutralEnglish = Object.values(i18n.decisionRecordT.en.delta).join(
      " "
    );
    expect(neutralEnglish).not.toMatch(
      /\b(?:winner|optimal|recommended|saving|savings|loss|confidence)\b/i
    );
    expect(i18n.decisionRecordT.en.sections.coverage).toBe(
      "Monetisation coverage"
    );
    expect(i18n.decisionRecordT.en.coverage.nonMonetized).toContain(
      "not monetised"
    );
    expect(JSON.stringify(i18n.decisionRecordT.en)).not.toMatch(
      /\b(?:monetized|materialized|labor)\b/i
    );
  });

  it("keeps the B2 profile and mechanisms terminology exact and paired", () => {
    function leafPaths(value: unknown, path = ""): string[] {
      if (typeof value === "string" || typeof value === "function") {
        return [path];
      }
      if (!value || typeof value !== "object") return [];
      return Object.entries(value).flatMap(([key, child]) =>
        leafPaths(child, path ? `${path}.${key}` : key)
      );
    }

    expect(i18n.assessmentT.pl.title).toBe(
      "Profil projektu procesu zakupowego"
    );
    expect(i18n.assessmentT.en.title).toBe(
      "Procurement process design profile"
    );
    expect(i18n.mechanismsEvidenceT.pl.title).toBe("Mechanizmy i źródła");
    expect(i18n.mechanismsEvidenceT.en.title).toBe(
      "Mechanisms and evidence"
    );
    expect(leafPaths(i18n.assessmentT.pl).sort()).toEqual(
      leafPaths(i18n.assessmentT.en).sort()
    );
    expect(leafPaths(i18n.mechanismsEvidenceT.pl).sort()).toEqual(
      leafPaths(i18n.mechanismsEvidenceT.en).sort()
    );
  });

  it("keeps legacy calculations and scoring imports out of the B2 public surfaces", async () => {
    const b2Files = [
      "components/EvidenceFieldHome.tsx",
      "components/AssessmentQuiz.tsx",
      "components/MechanismsEvidencePage.tsx",
      "app/(pl)/assessment/page.tsx",
      "app/(en)/en/assessment/page.tsx",
      "app/(pl)/case-studies/page.tsx",
      "app/(en)/en/case-studies/page.tsx",
    ] as const;

    for (const path of b2Files) {
      const source = await readPublicFile(path);
      expect(source, path).not.toMatch(
        /@\/lib\/(?:calculations|scenarios|process-templates)|BoundaryField|DecisionMap|PROCESS_TYPE_META|TECH_LEVELS|\btotalScore\b|\bpct\b/
      );
    }
  });

  it("keeps Polish navigation labels in Polish", () => {
    const labels = navigationFor("pl").map((item) => item.label);

    expect(labels).toEqual(["Kalkulator", "Warunki zastosowania", "Profil projektu procesu zakupowego", "Model"]);
    expect(labels).not.toEqual(expect.arrayContaining(["Research paper", "Methodology"]));
  });

  it("keeps public markup free of JSX comments and unbounded-field claims", async () => {
    for (const path of currentPublicFiles) {
      const content = await readPublicFile(path);
      expect(content, path).not.toContain("{/*");
      expect(content, path).not.toMatch(/infinite compliant paths/i);
    }
  });

  it("keeps every current public source free of unapproved em dashes", async () => {
    assertNoUnapprovedEmDashes(await readCurrentPublicSources());
  });

  it("rejects a new prose em dash in a previously omitted public source", async () => {
    const sources = await readCurrentPublicSources();
    const mutatedSources = sources.map((source) => source.path === "lib/i18n.ts"
      ? {
          ...source,
          content: `${source.content}\nexport const regressionFixture = "Nowa — treść";\n`,
        }
      : source);

    expect(() => assertNoUnapprovedEmDashes(mutatedSources))
      .toThrow(/lib\/i18n\.ts.*Nowa — treść/);
  });

  it("describes optimizer paths factually in both languages", () => {
    const dialogue = PATHS.dialog_konkurencyjny;

    expect(dialogue.description).not.toMatch(/Idealny dla/i);
    expect(dialogue.descriptionEn).not.toMatch(/Ideal for/i);
    expect(dialogue.description).toContain("Tryb przewidziany dla");
    expect(dialogue.descriptionEn).toContain("A procedure intended for");
  });

  it("renders the Polish-only research agenda from typed Polish copy", () => {
    expect(i18n).toHaveProperty("researchAgendaT.pl");
    const researchAgendaT = (
      i18n as typeof i18n & {
        researchAgendaT?: {
          pl: {
            eyebrow: (version: string) => string;
            title: string;
            intro: string;
            prioritiesTitle: string;
            priorities: readonly string[];
            identificationTitle: string;
            identificationRule: string;
            statusTitle: string;
            status: (version: string) => string;
            actions: { paper: string; methodology: string; scenarios: string };
          };
        };
      }
    ).researchAgendaT;
    expect(researchAgendaT).toBeDefined();
    expect(researchAgendaT?.pl.identificationRule)
      .toContain("we wspólnych ramach prawnych i ładu zakupowego");

    const markup = renderToStaticMarkup(createElement(ResearchAgendaPage));
    const copy = researchAgendaT!.pl;

    for (const value of [
      copy.eyebrow(MODEL_V2_METADATA.modelVersion),
      copy.title,
      copy.intro,
      copy.prioritiesTitle,
      ...copy.priorities,
      copy.identificationTitle,
      copy.identificationRule,
      copy.statusTitle,
      copy.status(MODEL_V2_METADATA.modelVersion),
      ...Object.values(copy.actions),
    ]) {
      expect(markup).toContain(value);
    }
    expect(markup).not.toContain("Validate mechanisms before monetizing them");
    expect(markup).not.toContain("Measurement priorities");
    expect(markup).not.toContain("Current status");
  });

  it("does not disable the image lint rule for the entire footer", async () => {
    const source = await readPublicFile("components/SiteFooter.tsx");
    expect(source).not.toMatch(/eslint-disable.*@next\/next\/no-img-element/);
  });

  it("keeps rendered Polish and English team content free of inflated role claims", () => {
    for (const lang of ["pl", "en"] as const) {
      const content = renderToStaticMarkup(createElement(TeamPage, { lang }));
      for (const phrase of forbiddenTeamPhrases) {
        expect(content, lang).not.toContain(phrase);
      }
    }
  });

  it("keeps shared team copy structurally aligned in Polish and English", () => {
    expect(i18n).toHaveProperty("teamT");

    const teamT = i18n.teamT;
    expect(Object.keys(teamT.pl)).toEqual(Object.keys(teamT.en));
    expect(Object.keys(teamT.pl.roles)).toEqual(Object.keys(teamT.en.roles));
    expect(Object.keys(teamT.pl.competencies)).toEqual(Object.keys(teamT.en.competencies));
  });

  it("provides English content for every planned Shortcast", () => {
    expect(EPISODES).toEqual(expect.arrayContaining([
      expect.objectContaining({
        titleEn: `ProcuraCost ${MODEL_V2_METADATA.modelVersion}: what does the cost model compare?`,
        dimensionEn: "Methodology",
        focusEn: "Calculation contract",
      }),
      expect.objectContaining({
        titleEn: "The Szucs study: discretion, competition and price",
        dimensionEn: "Competition and contractor selection",
        focusEn: "Source review",
      }),
    ]));

    for (const episode of EPISODES) {
      expect(episode.titleEn).toEqual(expect.any(String));
      expect(episode.thesisEn).toEqual(expect.any(String));
      expect(episode.focusEn).toEqual(expect.any(String));
      expect(episode.practiceNoteEn).toEqual(expect.any(String));
      expect(episode.titleEn).not.toBe(episode.title);
      expect(episode.thesisEn).not.toBe(episode.thesis);
    }
  });

  it("keeps Shortcast framing in the shared English dictionary", () => {
    expect(i18n).toHaveProperty("shortcastsT.en.plannedTopics", "Planned topics");
    expect(i18n).toHaveProperty("shortcastsT.en.focusLabel", "Focus");
  });

  it("renders planned Shortcasts in English", () => {
    const markup = renderToStaticMarkup(createElement(ShortcastyEnPage));
    const firstEpisode = EPISODES[0];

    expect(markup).toContain(firstEpisode.titleEn);
    expect(markup).toContain(firstEpisode.dimensionEn);
    expect(markup).toContain(firstEpisode.focusEn);
    expect(markup).toContain(firstEpisode.thesisEn);
    expect(markup).not.toContain(firstEpisode.title);
    expect(markup).not.toContain(firstEpisode.thesis);
  });

  it("uses linear analytical Shortcast indexes", () => {
    const polishMarkup = renderToStaticMarkup(createElement(ShortcastyPage));
    const englishMarkup = renderToStaticMarkup(createElement(ShortcastyEnPage));

    for (const markup of [polishMarkup, englishMarkup]) {
      expect(markup).toContain('data-editorial-index="shortcasts"');
      expect(markup).toContain("border-y");
      expect(markup).not.toContain("bg-gradient");
      expect(markup).not.toContain("shadow");
    }
  });

  it("keeps future English episodes non-linking while Polish owns its detail route", () => {
    const episode = EPISODES[0];
    const previousPublishedAt = episode.publishedAt;
    episode.publishedAt = "2026-08-25";

    try {
      const polishMarkup = renderToStaticMarkup(createElement(ShortcastyPage));
      const englishMarkup = renderToStaticMarkup(createElement(ShortcastyEnPage));

      expect(polishMarkup).toContain(`href="/shortcasty/${episode.slug}"`);
      expect(englishMarkup).toContain(episode.titleEn);
      expect(englishMarkup).not.toContain(`href="/shortcasty/${episode.slug}"`);
    } finally {
      if (previousPublishedAt) episode.publishedAt = previousPublishedAt;
      else delete episode.publishedAt;
    }
  });

  it("uses an editorial record on a published Polish Shortcast detail", async () => {
    const episode = EPISODES[0];
    const previousPublishedAt = episode.publishedAt;
    episode.publishedAt = "2026-08-25";

    try {
      const page = await ShortcastEpisodePage({
        params: Promise.resolve({ slug: episode.slug }),
      });
      const markup = renderToStaticMarkup(page);

      expect(markup).toContain('data-editorial-detail="shortcast"');
      expect(markup).toContain("border-y");
      expect(markup).not.toContain("rounded-2xl bg-blue-600");
      expect(markup).not.toMatch(/rounded-xl border border-(?:gray|green|blue)/);
      expect(markup).not.toContain("bg-gradient");
      expect(markup).toContain(episode.title);
    } finally {
      if (previousPublishedAt) episode.publishedAt = previousPublishedAt;
      else delete episode.publishedAt;
    }
  });

  it("localizes project title attributes in the English footer", () => {
    const polishMarkup = renderToStaticMarkup(createElement(SiteFooter, { lang: "pl" }));
    const englishMarkup = renderToStaticMarkup(createElement(SiteFooter, { lang: "en" }));

    expect(polishMarkup).toContain('title="Kalkulator podatku od milczenia"');
    expect(englishMarkup).toContain('title="Silence tax calculator"');
    expect(englishMarkup).toContain('title="Car TCO calculator"');
    expect(englishMarkup).toContain('title="Reminder platform"');
    expect(englishMarkup).toContain('title="Professional profile"');
    expect(englishMarkup).not.toContain('title="Kalkulator podatku od milczenia"');
    expect(englishMarkup).not.toContain('title="Profil zawodowy"');
  });
});

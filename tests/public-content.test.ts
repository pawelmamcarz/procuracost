import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import * as i18n from "@/lib/i18n";
import ShortcastyEnPage from "@/app/en/shortcasty/page";
import ResearchAgendaPage from "@/app/research-agenda/page";
import TeamPage from "@/components/TeamPage";
import { PATHS } from "@/lib/optimizer";
import { EPISODES } from "@/lib/shortcasty";
import { navigationFor } from "@/lib/site-routes";
import { MODEL_VERSION } from "@/lib/version";
import { APPROVED_PUBLIC_EM_DASH_LINES } from "./fixtures/approved-public-em-dashes";

const root = fileURLToPath(new URL("..", import.meta.url));

const currentPublicFiles = [
  "app/layout.tsx",
  "app/en/layout.tsx",
  "app/model/page.tsx",
  "app/en/model/page.tsx",
  "app/model/assumptions/layout.tsx",
  "app/en/model/assumptions/layout.tsx",
  "app/model/assumptions/page.tsx",
  "app/en/model/assumptions/page.tsx",
  "app/assessment/page.tsx",
  "app/en/assessment/page.tsx",
  "app/research-agenda/page.tsx",
  "app/shortcasty/page.tsx",
  "app/en/shortcasty/page.tsx",
  "app/shortcasty/[slug]/page.tsx",
  "app/en/case-studies/page.tsx",
  "app/icon.svg",
  "components/SiteFooter.tsx",
  "lib/i18n.ts",
  "lib/shortcasty.ts",
  "lib/scenarios.ts",
] as const;

const historicalI18nAllowList = [
  "Wpisanie 0 odtwarza niedyskontowany model 2.1.",
  "Model 2.1 stosuje szerokie mnożniki kontekstu wyłącznie do nakładu pracy i niepracowniczego narzutu koordynacyjnego. Pozostałe mechanizmy mają odrębne profile; 1,00 oznacza brak korekty.",
  "Entering 0 reproduces the undiscounted 2.1 model.",
  "Model 2.1 applies broad context multipliers only to staff effort and non-labor coordination overhead. Other mechanisms use separate profiles; 1.00 means no adjustment.",
] as const;

const staleCurrentVersion = /\b(?:model 2\.1|modelu 2\.1|ProcuraCost 2\.1)\b/i;
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
    for (const path of currentPublicFiles) {
      let content = await readPublicFile(path);
      if (path === "lib/i18n.ts") {
        for (const historicalSentence of historicalI18nAllowList) {
          content = content.replace(historicalSentence, "");
        }
      }

      expect(content, path).not.toMatch(staleCurrentVersion);
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

  it("keeps Polish navigation labels in Polish", () => {
    const labels = navigationFor("pl").map((item) => item.label);

    expect(labels).toEqual(expect.arrayContaining([
      "Artykuł naukowy",
      "Agenda badawcza",
      "Metodologia",
    ]));
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
      .toContain("kontroluj wyniki ze względu na złożoność zakupu");

    const markup = renderToStaticMarkup(createElement(ResearchAgendaPage));
    const copy = researchAgendaT!.pl;

    for (const value of [
      copy.eyebrow(MODEL_VERSION),
      copy.title,
      copy.intro,
      copy.prioritiesTitle,
      ...copy.priorities,
      copy.identificationTitle,
      copy.identificationRule,
      copy.statusTitle,
      copy.status(MODEL_VERSION),
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
        titleEn: `ProcuraCost ${MODEL_VERSION}: what do we actually compare?`,
        dimensionEn: "Methodology",
        focusEn: "Methodological clarification",
      }),
      expect.objectContaining({
        titleEn: "Szucs: what does discretion cost in contractor selection?",
        dimensionEn: "Competition · Selection",
        focusEn: "Source review",
      }),
    ]));

    for (const episode of EPISODES) {
      expect(episode.titleEn).toEqual(expect.any(String));
      expect(episode.thesisEn).toEqual(expect.any(String));
      expect(episode.focusEn).toEqual(expect.any(String));
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
});

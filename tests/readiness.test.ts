import { createElement } from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ReadinessDiagnostic from "@/components/ReadinessDiagnostic";
import { readinessT } from "@/lib/i18n";
import { calculateComparison } from "@/lib/model-v2/engine";
import { SCENARIOS_V2 } from "@/lib/model-v2/scenarios";
import {
  READINESS_CHECKLIST_PROVENANCE,
  READINESS_DOMAINS,
  READINESS_RESPONSE_OPTIONS,
  summariseReadinessResponses,
  type ReadinessResponseOption,
  type ReadinessResponses,
} from "@/lib/readiness";

const EXPECTED_DOMAIN_IDS = [
  "purpose",
  "ownership",
  "process",
  "requirements",
  "data_automation",
  "governance",
  "adoption",
  "value_rollout",
] as const;

const EXPECTED_QUESTION_IDS = [
  "purpose.friction",
  "purpose.success",
  "ownership.business_owner",
  "ownership.sponsorship",
  "process.current_state",
  "process.target_state",
  "requirements.traceability",
  "requirements.discovery",
  "data_automation.data",
  "data_automation.ai",
  "governance.boundary",
  "governance.approvals",
  "adoption.users",
  "adoption.plan",
  "value_rollout.business_case",
  "value_rollout.rollout",
] as const;

function completeResponses(response: ReadinessResponseOption): ReadinessResponses {
  return Object.fromEntries(
    EXPECTED_QUESTION_IDS.map((questionId) => [questionId, response]),
  ) as ReadinessResponses;
}

function leafPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  );
}

function objectKeys(value: unknown): string[] {
  if (typeof value !== "object" || value === null) return [];
  return Object.entries(value).flatMap(([key, child]) => [key, ...objectKeys(child)]);
}

function stringLeaves(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value !== "object" || value === null) return [];
  return Object.values(value).flatMap(stringLeaves);
}

describe("implementation readiness self-description contract", () => {
  it("defines exactly eight ordered domains, two ordered questions each, and three response options", () => {
    expect(READINESS_RESPONSE_OPTIONS).toEqual([
      "not_met",
      "to_complete",
      "confirmed",
    ]);
    expect(READINESS_DOMAINS.map(({ id }) => id)).toEqual(EXPECTED_DOMAIN_IDS);
    expect(READINESS_DOMAINS.every(({ questions }) => questions.length === 2)).toBe(true);
    expect(
      READINESS_DOMAINS.flatMap(({ questions }) => questions.map(({ id }) => id)),
    ).toEqual(EXPECTED_QUESTION_IDS);
    expect(new Set(EXPECTED_QUESTION_IDS)).toHaveLength(16);
  });

  it("keeps Polish and English domain, question, answer, and response copy structurally identical", () => {
    expect(leafPaths(readinessT.en).sort()).toEqual(leafPaths(readinessT.pl).sort());

    for (const domain of READINESS_DOMAINS) {
      expect(readinessT.pl.domains[domain.id].label).toBeTruthy();
      expect(readinessT.en.domains[domain.id].label).toBeTruthy();
      for (const question of domain.questions) {
        expect(Object.keys(readinessT.pl.questions[question.id].answers)).toEqual(
          READINESS_RESPONSE_OPTIONS,
        );
        expect(Object.keys(readinessT.en.questions[question.id].answers)).toEqual(
          READINESS_RESPONSE_OPTIONS,
        );
      }
    }
  });

  it("uses professional bilingual implementation language without unsupported precision", () => {
    expect(readinessT.pl.title).toBe("Gotowość organizacyjna do wdrożenia");
    expect(readinessT.en.title).toBe("Organisational implementation readiness");

    const polishCopy = stringLeaves(readinessT.pl).join("\n");
    const englishCopy = stringLeaves(readinessT.en).join("\n");

    expect(polishCopy).not.toMatch(
      /6[–-]8|minimalne warunki v1|\b1[–-]3\b|\b2[–-]4\b|discovery|end-to-end|go-live|business case|rollout|big bang|source-to-pay|as-is\/to-be|fallback/i,
    );
    expect(englishCopy).not.toMatch(
      /6[–-]8|v1 minimum|one to three|two to four|discovery|end-to-end|go-live|business case|rollout|big bang|source-to-pay|as-is\/to-be|fallback/i,
    );
    expect(readinessT.pl.sourceNote).toMatch(/rozmowa branżowa/i);
    expect(readinessT.en.sourceNote).toContain("practitioner interview");
    expect(readinessT.pl.sourceNote).not.toContain("wywiad ekspercki");
    expect(readinessT.en.sourceNote).not.toContain("expert interview");

    expect(polishCopy).not.toMatch(/\b(?:BLOKADA|GOTOWY|RYZYKO)\b/);
    expect(polishCopy).not.toMatch(
      /decyzj[aię]\s+go\/no-go|można rozpocząć|wstrzymać wdrożenie/i,
    );
    expect(englishCopy).not.toMatch(/\b(?:BLOCKED|READY|AT RISK)\b/);
    expect(englishCopy).not.toMatch(
      /go\/no-go decision|may begin|pause implementation|should not begin/i,
    );
    expect(readinessT.pl.summary.body).toMatch(
      /samoopis|nie jest walidacją|nie stanowi rekomendacji/i,
    );
    expect(readinessT.en.summary.body).toMatch(
      /self-description|not a validation|does not recommend/i,
    );
  });

  it("keeps the authored checklist provenance separate from thematic interview references", () => {
    expect(READINESS_CHECKLIST_PROVENANCE).toEqual({
      id: "procuracost-authored-readiness-checklist-v1",
      kind: "authored_operational_checklist",
      basis: "author_defined_operational_hypotheses",
      intendedUse: "self_description_and_internal_discussion_only",
    });

    for (const domain of READINESS_DOMAINS) {
      expect(domain.thematicSourceRefIds.length, domain.id).toBeGreaterThan(0);
      for (const question of domain.questions) {
        expect(question.checklistProvenanceId).toBe(
          READINESS_CHECKLIST_PROVENANCE.id,
        );
        expect(question).not.toHaveProperty("sourceRefIds");
        expect(question).not.toHaveProperty("thematicSourceRefIds");
      }
    }
  });

  it("summarises declared responses without assigning a gate or overall category", () => {
    const responses = completeResponses("confirmed");
    responses["purpose.friction"] = "not_met";
    responses["purpose.success"] = "to_complete";

    const summary = summariseReadinessResponses(responses);

    expect(summary).toMatchObject({
      version: "1.1",
      responseCounts: {
        not_met: 1,
        to_complete: 1,
        confirmed: 14,
      },
    });
    expect(summary?.domains[0]).toEqual({
      domainId: "purpose",
      questionIds: {
        not_met: ["purpose.friction"],
        to_complete: ["purpose.success"],
        confirmed: [],
      },
    });
    expect(summary).not.toHaveProperty("status");
    expect(summary?.domains[0]).not.toHaveProperty("status");
    expect(summary?.domains.map(({ domainId }) => domainId)).toEqual(
      EXPECTED_DOMAIN_IDS,
    );
  });

  it("returns null for every possible single missing answer", () => {
    for (const missingQuestionId of EXPECTED_QUESTION_IDS) {
      const responses = completeResponses("confirmed");
      delete responses[missingQuestionId];
      expect(summariseReadinessResponses(responses), missingQuestionId).toBeNull();
    }
  });

  it("contains no scoring, validation, gating, probability, or recommendation fields", () => {
    const summary = summariseReadinessResponses(completeResponses("confirmed"));
    const keys = objectKeys({ domains: READINESS_DOMAINS, summary });
    expect(keys.join(" ")).not.toMatch(
      /score|points|percentage|weight|threshold|status|gate|probability|validation|recommendation/i,
    );
  });
});
describe("implementation readiness separation", () => {
  it("does not import the cost model, process templates, scenarios, optimizer, or model-v2 barrel", () => {
    const ownedFiles = ["lib/readiness.ts", "components/ReadinessDiagnostic.tsx"];
    const forbiddenImports =
      /(?:calculations|process-templates|scenarios|optimizer|model-v2\/(?:engine|scenarios|index)|from\s+["']@\/lib\/model-v2["'])/;

    for (const file of ownedFiles) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(forbiddenImports);
    }
  });

  it("cannot alter a complete model comparison for any self-description response", () => {
    const scenario = SCENARIOS_V2.find(
      ({ id }) => id === "public_it_open_with_market_consultation",
    )!;
    const before = calculateComparison(scenario.calculationInput);

    for (const response of READINESS_RESPONSE_OPTIONS) {
      expect(
        summariseReadinessResponses(completeResponses(response))?.responseCounts[
          response
        ],
      ).toBe(EXPECTED_QUESTION_IDS.length);
    }

    const after = calculateComparison(scenario.calculationInput);
    expect(after).toEqual(before);
    expect(after.deltaCost).toBe(before.deltaCost);
  });
});

describe("readiness diagnostic accessibility contract", () => {
  it("renders one domain as two native fieldsets with six named radio inputs", () => {
    const markup = renderToStaticMarkup(
      createElement(ReadinessDiagnostic, { lang: "en" }),
    );

    expect(markup.match(/<fieldset\b/g)).toHaveLength(2);
    expect(markup.match(/<legend\b/g)).toHaveLength(2);
    expect(markup.match(/type="radio"/g)).toHaveLength(6);
    expect(markup).toContain("Domain 1 of 8");
    expect(markup).toContain("Not met");
    expect(markup).toContain("Needs completion");
    expect(markup).toContain("Confirmed");
    expect(markup).toContain('aria-describedby="readiness-source-note"');
    expect(markup).toContain("disabled");
    expect(markup).not.toMatch(/progressbar|aria-valuenow/);
  });

  it("implements focus movement on the summary transition without persistence", () => {
    const source = readFileSync("components/ReadinessDiagnostic.tsx", "utf8");

    expect(source).toMatch(/useEffect\(\(\)\s*=>\s*\{[\s\S]*summaryHeadingRef\.current\?\.focus\(\)/);
    expect(source).toMatch(/<h2[\s\S]*ref=\{summaryHeadingRef\}[\s\S]*tabIndex=\{-1\}/);
    expect(source).toMatch(/<dl[\s\S]*READINESS_RESPONSE_OPTIONS/);
    expect(source).not.toMatch(/OctagonX|STATUS_PRESENTATION|worstStatus/);
    expect(source).not.toMatch(/localStorage|sessionStorage|URLSearchParams|fetch\(|sendBeacon/);
  });
});

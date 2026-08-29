import { createElement } from "react";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ReadinessDiagnostic from "@/components/ReadinessDiagnostic";
import { readinessT } from "@/lib/i18n";
import { calculateComparison } from "@/lib/model-v2/engine";
import { SCENARIOS_V2 } from "@/lib/model-v2/scenarios";
import {
  READINESS_DOMAINS,
  READINESS_STATUSES,
  evaluateReadiness,
  type ReadinessQuestionId,
  type ReadinessResponses,
  type ReadinessStatus,
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

function completeResponses(status: ReadinessStatus): ReadinessResponses {
  return Object.fromEntries(
    EXPECTED_QUESTION_IDS.map((questionId) => [questionId, status]),
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

describe("implementation readiness domain contract", () => {
  it("defines exactly eight ordered domains, two ordered questions each, and three statuses", () => {
    expect(READINESS_STATUSES).toEqual(["blocked", "risk", "ready"]);
    expect(READINESS_DOMAINS.map(({ id }) => id)).toEqual(EXPECTED_DOMAIN_IDS);
    expect(READINESS_DOMAINS.every(({ questions }) => questions.length === 2)).toBe(true);
    expect(
      READINESS_DOMAINS.flatMap(({ questions }) => questions.map(({ id }) => id)),
    ).toEqual(EXPECTED_QUESTION_IDS);
    expect(new Set(EXPECTED_QUESTION_IDS)).toHaveLength(16);
  });

  it("keeps Polish and English domain, question, answer, and status copy structurally identical", () => {
    expect(leafPaths(readinessT.en).sort()).toEqual(leafPaths(readinessT.pl).sort());

    for (const domain of READINESS_DOMAINS) {
      expect(readinessT.pl.domains[domain.id].label).toBeTruthy();
      expect(readinessT.en.domains[domain.id].label).toBeTruthy();
      for (const question of domain.questions) {
        expect(Object.keys(readinessT.pl.questions[question.id].answers)).toEqual(
          READINESS_STATUSES,
        );
        expect(Object.keys(readinessT.en.questions[question.id].answers)).toEqual(
          READINESS_STATUSES,
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
    expect(readinessT.pl.sourceNote).toContain("rozmowa branżowa");
    expect(readinessT.en.sourceNote).toContain("practitioner interview");
    expect(readinessT.pl.sourceNote).not.toContain("wywiad ekspercki");
    expect(readinessT.en.sourceNote).not.toContain("expert interview");
  });

  it.each([
    ["blocked", "blocked", "blocked"],
    ["blocked", "risk", "blocked"],
    ["blocked", "ready", "blocked"],
    ["risk", "blocked", "blocked"],
    ["risk", "risk", "risk"],
    ["risk", "ready", "risk"],
    ["ready", "blocked", "blocked"],
    ["ready", "risk", "risk"],
    ["ready", "ready", "ready"],
  ] as const)(
    "aggregates a %s/%s domain as %s",
    (first, second, expected) => {
      const responses = completeResponses("ready");
      responses["purpose.friction"] = first;
      responses["purpose.success"] = second;

      const result = evaluateReadiness(responses);

      expect(result?.domains[0]).toEqual({
        domainId: "purpose",
        status: expected,
        riskQuestionIds: [first, second]
          .map((status, index) =>
            status === "risk" ? EXPECTED_QUESTION_IDS[index] : null,
          )
          .filter(Boolean) as ReadinessQuestionId[],
        blockedQuestionIds: [first, second]
          .map((status, index) =>
            status === "blocked" ? EXPECTED_QUESTION_IDS[index] : null,
          )
          .filter(Boolean) as ReadinessQuestionId[],
      });
    },
  );

  it("uses the worst domain for the overall gate and preserves source order", () => {
    const atRisk = completeResponses("ready");
    atRisk["governance.approvals"] = "risk";
    const blocked = { ...atRisk, "ownership.sponsorship": "blocked" } satisfies ReadinessResponses;

    expect(evaluateReadiness(completeResponses("ready"))?.status).toBe("ready");
    expect(evaluateReadiness(atRisk)?.status).toBe("risk");
    expect(evaluateReadiness(blocked)?.status).toBe("blocked");
    expect(evaluateReadiness(blocked)?.domains.map(({ domainId }) => domainId)).toEqual(
      EXPECTED_DOMAIN_IDS,
    );
  });

  it("returns null for every possible single missing answer", () => {
    for (const missingQuestionId of EXPECTED_QUESTION_IDS) {
      const responses = completeResponses("ready");
      delete responses[missingQuestionId];
      expect(evaluateReadiness(responses), missingQuestionId).toBeNull();
    }
  });

  it("contains no scoring, weighting, percentage, or threshold fields", () => {
    const result = evaluateReadiness(completeResponses("ready"));
    const keys = objectKeys({ domains: READINESS_DOMAINS, result });
    expect(keys.join(" ")).not.toMatch(/score|points|percentage|weight|threshold/i);
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

  it("cannot alter a complete model comparison for ready, risk, or blocked responses", () => {
    const scenario = SCENARIOS_V2.find(
      ({ id }) => id === "public_it_open_with_market_consultation",
    )!;
    const before = calculateComparison(scenario.calculationInput);

    for (const status of READINESS_STATUSES) {
      expect(evaluateReadiness(completeResponses(status))?.status).toBe(status);
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
    expect(markup).toContain("disabled");
    expect(markup).not.toMatch(/progressbar|aria-valuenow/);
  });

  it("implements focus movement on the result-view transition without persistence", () => {
    const source = readFileSync("components/ReadinessDiagnostic.tsx", "utf8");

    expect(source).toMatch(/useEffect\(\(\)\s*=>\s*\{[\s\S]*resultHeadingRef\.current\?\.focus\(\)/);
    expect(source).toMatch(/<h2[\s\S]*ref=\{resultHeadingRef\}[\s\S]*tabIndex=\{-1\}/);
    expect(source).not.toMatch(/localStorage|sessionStorage|URLSearchParams|fetch\(|sendBeacon/);
  });
});

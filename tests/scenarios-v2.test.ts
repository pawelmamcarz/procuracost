import { describe, expect, it } from "vitest";

import { modelV2T } from "@/lib/i18n";
import { calculateComparison } from "@/lib/model-v2/engine";
import {
  EVIDENCE_REGISTRY,
  OFFICIAL_EVIDENCE_IDS,
} from "@/lib/model-v2/evidence";
import {
  LEGACY_SCENARIO_ALIASES,
  SCENARIO_V2_IDS,
  SCENARIOS_V2,
  createScenarioDraft,
} from "@/lib/model-v2/scenarios";
import {
  TECH_LEVELS,
  deriveStepTimings,
  getSteps,
} from "@/lib/process-templates";
import { SCENARIOS } from "@/lib/scenarios";

const EXPECTED_SCENARIOS = [
  ["fleet_tco_reframing", "fleet"],
  ["erp_transformation_discovery", "erp"],
  ["logistics_service_redesign", "logistics"],
  ["critical_material_continuity", "production"],
  ["public_it_open_with_market_consultation", "pipe_vs_field"],
  ["stable_private_standard_service", "governance_control"],
  ["stable_capex_replacement", "capex_investment"],
  ["discovery_solution_codesign", "discovery_rd"],
  ["catalog_calloff_control", "catalog"],
  ["mrp_release_control", "mrp"],
] as const;

function flattenCopyKeys(value: unknown, prefix = ""): string[] {
  if (typeof value === "string") return [prefix];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    flattenCopyKeys(child, prefix ? `${prefix}.${key}` : key)
  );
}

function copyAt(lang: "pl" | "en", key: string): string | undefined {
  return key.split(".").reduce<unknown>((value, part) => {
    if (!value || typeof value !== "object") return undefined;
    return (value as Record<string, unknown>)[part];
  }, modelV2T[lang]) as string | undefined;
}

describe("model 2.3 canonical scenarios", () => {
  it("registers exactly the ten canonical IDs with manual legacy aliases", () => {
    expect(SCENARIO_V2_IDS).toEqual(EXPECTED_SCENARIOS.map(([id]) => id));
    expect(SCENARIOS_V2).toHaveLength(10);
    expect(SCENARIOS_V2.map(({ id }) => id)).toEqual(SCENARIO_V2_IDS);
    expect(
      EXPECTED_SCENARIOS.map(([, alias]) => [
        alias,
        LEGACY_SCENARIO_ALIASES[alias],
      ])
    ).toEqual(EXPECTED_SCENARIOS.map(([id, alias]) => [alias, id]));
    expect(SCENARIOS_V2.some(({ id }) => id === ("custom" as string))).toBe(
      false
    );
  });

  it("creates a user draft from a scenario without adding an eleventh registry entry", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    const source = SCENARIOS_V2[0];

    expect(draft.kind).toBe("user_draft");
    expect(draft.derivedFromScenarioId).toBe("fleet_tco_reframing");
    expect(draft.alternatives).not.toBe(
      source.calculationInput.alternatives
    );
    expect(draft.context).toEqual(source.context);
    expect(draft.economicAssumptions).toEqual(source.economicAssumptions);
    expect(draft.economicAssumptions).not.toBe(source.economicAssumptions);
    expect(draft.dailyCostOfInaction).toBe(
      draft.economicAssumptions.dailyCostOfInaction
    );
    expect(SCENARIOS_V2).toHaveLength(10);
  });

  it("keeps every scenario copy key and retained assumption available in PL and EN", () => {
    for (const scenario of SCENARIOS_V2) {
      for (const key of [
        scenario.nameKey,
        scenario.descriptionKey,
        scenario.source.titleKey,
        scenario.source.publisherKey,
        ...scenario.assumptions.flatMap((assumption) => [
          assumption.labelKey,
          assumption.detailKey,
          assumption.source.titleKey,
          assumption.source.publisherKey,
        ]),
        ...[
          scenario.calculationInput.alternatives.formalSequential,
          scenario.calculationInput.alternatives.adaptiveCompliant,
        ].flatMap(({ workflowDesign }) =>
          workflowDesign.steps.map(({ labelKey }) => labelKey)
        ),
      ]) {
        expect(copyAt("pl", key), `${scenario.id}: ${key} PL`).toBeTruthy();
        expect(copyAt("en", key), `${scenario.id}: ${key} EN`).toBeTruthy();
      }

      expect(scenario.sourceUrl).toMatch(/^https:\/\//);
      expect(scenario.assumptions.length).toBeGreaterThan(0);
      expect(
        scenario.assumptions.every(
          ({ evidenceClass, sourceUrl, constructs }) =>
            evidenceClass === "retained_legacy_assumption" &&
            sourceUrl.startsWith("https://") &&
            constructs.length > 0
        )
      ).toBe(true);
    }

    expect(flattenCopyKeys(modelV2T.pl)).toEqual(
      flattenCopyKeys(modelV2T.en)
    );
  });

  it("labels migrated economics as retained assumptions and applies only declared stresses", () => {
    for (const scenario of SCENARIOS_V2) {
      const { economicAssumptions } = scenario;
      const centralDailyCost = economicAssumptions.dailyCostOfInaction.central;

      expect(economicAssumptions.contractValue.evidenceClass).toBe(
        "retained_legacy_assumption"
      );
      expect(economicAssumptions.dailyCostOfInaction).toMatchObject({
        low: centralDailyCost * 0.25,
        high: centralDailyCost * 4,
        rangeKind: "stress",
        evidenceClass: "retained_legacy_assumption",
      });
      expect(economicAssumptions.amendmentDifferential.central).toBe(0);
      expect(economicAssumptions.tcoDifferential.central).toBe(0);
      expect(economicAssumptions.bypass.status).toBe("notMonetized");

      if (economicAssumptions.pathCompetitionDiffers) {
        expect(economicAssumptions.competitionTransferRate).toMatchObject({
          low: 0.02,
          central: 0.06,
          high: 0.09,
          rangeKind: "stress",
          evidenceClass: "empirical_anchor",
        });
      } else {
        expect(economicAssumptions.competitionTransferRate).toBeNull();
      }
    }
  });

  it("retains the legacy scenario centres and workflow timings as labelled assumptions", () => {
    for (const scenario of SCENARIOS_V2) {
      const legacyScenario = SCENARIOS.find(
        ({ id }) => id === scenario.legacyAliases[0]
      )!;
      const legacyTiming = deriveStepTimings(
        getSteps(legacyScenario.inputs.processType),
        TECH_LEVELS[legacyScenario.inputs.techLevel].timeMultiplier
      );
      const result = calculateComparison(scenario.calculationInput);

      expect(scenario.economicAssumptions.contractValue.central).toBe(
        legacyScenario.inputs.contractValue
      );
      expect(scenario.economicAssumptions.dailyCostOfInaction.central).toBe(
        legacyScenario.inputs.dailyCostOfInaction
      );
      expect(result.formalSequential.elapsedDays.central).toBe(
        legacyTiming.rigidDays
      );
      expect(result.adaptiveCompliant.elapsedDays.central).toBe(
        legacyTiming.flexibleDays
      );
      for (const [roleId, rate] of Object.entries(
        scenario.calculationInput.roleHourlyRates
      )) {
        expect(rate.central * 8, `${scenario.id}.${roleId}`).toBe(
          legacyScenario.inputs.stakeholders[
            roleId as keyof typeof legacyScenario.inputs.stakeholders
          ].dailyRate
        );
        expect(rate.evidenceClass).toBe("retained_legacy_assumption");
      }
    }
  });

  it("keeps catalog and MRP controls at zero delta when their maps match", () => {
    for (const scenarioId of [
      "catalog_calloff_control",
      "mrp_release_control",
    ] as const) {
      const scenario = SCENARIOS_V2.find(({ id }) => id === scenarioId);
      expect(scenario).toBeDefined();
      expect(scenario?.calculationInput.alternatives.formalSequential).toEqual(
        scenario?.calculationInput.alternatives.adaptiveCompliant
      );

      const result = calculateComparison(scenario!.calculationInput);
      expect(result.deltaCost).toBe(0);
      expect(result.formalSequential.totalCost).toEqual(
        result.adaptiveCompliant.totalCost
      );
    }
  });

  it("makes adaptive discovery slower without asserting a preferred cost sign", () => {
    const scenario = SCENARIOS_V2.find(
      ({ id }) => id === "discovery_solution_codesign"
    );
    const result = calculateComparison(scenario!.calculationInput);

    expect(result.adaptiveCompliant.elapsedDays.central).toBeGreaterThan(
      result.formalSequential.elapsedDays.central
    );
  });

  it("uses identical fixed legal waits in both public alternatives", () => {
    const scenario = SCENARIOS_V2.find(
      ({ id }) => id === "public_it_open_with_market_consultation"
    );
    const alternatives = scenario!.calculationInput.alternatives;
    const legalSteps = (alternative: "formalSequential" | "adaptiveCompliant") =>
      alternatives[alternative].workflowDesign.steps
        .filter(({ kind }) => kind === "legal_wait")
        .map(({ id, activeDays, queueDays, lockedLegalProvenance }) => ({
          id,
          activeDays,
          queueDays,
          lockedLegalProvenance,
        }));

    expect(legalSteps("formalSequential")).toEqual(
      legalSteps("adaptiveCompliant")
    );
    expect(
      legalSteps("formalSequential").every(
        ({ activeDays, queueDays }) =>
          activeDays.rangeKind === "fixed" && queueDays.rangeKind === "fixed"
      )
    ).toBe(true);
    expect(() => calculateComparison(scenario!.calculationInput)).not.toThrow();
  });
});

describe("model 2.3 evidence registry", () => {
  it("contains the four required official records with bounded provenance", () => {
    expect(OFFICIAL_EVIDENCE_IDS).toEqual([
      "california_modular_it_procurement",
      "oecd_rvul_problem_definition",
      "uzp_preliminary_market_consultation",
      "ec_innovation_procurement_guidance",
    ]);

    for (const evidenceId of OFFICIAL_EVIDENCE_IDS) {
      const record = EVIDENCE_REGISTRY.find(({ id }) => id === evidenceId);
      expect(record, evidenceId).toBeDefined();
      expect(record?.type).toBe("official_case");
      expect(record?.sourceUrl).toMatch(/^https:\/\//);
      expect(record?.constructs.length).toBeGreaterThan(0);
      expect(record?.assumptionKeys.length).toBeGreaterThan(0);
      for (const key of [
        record!.source.titleKey,
        record!.source.publisherKey,
        record!.supportedClaimKey,
        record!.unsupportedClaimKey,
        record!.jurisdictionOrPopulationKey,
        ...record!.assumptionKeys,
      ]) {
        expect(copyAt("pl", key), `${record!.id}: ${key} PL`).toBeTruthy();
        expect(copyAt("en", key), `${record!.id}: ${key} EN`).toBeTruthy();
      }
    }
  });

  it("keeps active evidence free of Ryanair and Zara claims", () => {
    expect(JSON.stringify(EVIDENCE_REGISTRY)).not.toMatch(/ryanair|zara/i);
  });

  it("resolves every scenario evidence reference to evidence or its own assumptions", () => {
    const evidenceIds = new Set(EVIDENCE_REGISTRY.map(({ id }) => id));

    for (const scenario of SCENARIOS_V2) {
      const assumptionIds = new Set(scenario.assumptions.map(({ id }) => id));
      expect(
        scenario.evidenceIds.every((id) => evidenceIds.has(id)),
        `${scenario.id}: evidence IDs`
      ).toBe(true);

      const calibratedValues = [
        scenario.economicAssumptions.contractValue,
        scenario.economicAssumptions.dailyCostOfInaction,
        scenario.economicAssumptions.amendmentDifferential,
        scenario.economicAssumptions.tcoDifferential,
        ...Object.values(scenario.calculationInput.roleHourlyRates),
        ...[
          scenario.calculationInput.alternatives.formalSequential,
          scenario.calculationInput.alternatives.adaptiveCompliant,
        ].flatMap(
          ({ workflowDesign, contractDesign }) => [
            ...workflowDesign.steps.flatMap((step) => [
              step.activeDays,
              step.queueDays,
              step.nonLabourCost,
              ...Object.values(step.roleHours),
            ]),
            ...contractDesign.dimensions.flatMap((dimension) =>
              dimension.status === "monetized" ? [dimension.cost] : []
            ),
          ]
        ),
      ];

      for (const value of calibratedValues) {
        expect(
          value.evidenceIds.every(
            (id) => assumptionIds.has(id) || evidenceIds.has(id) || id.startsWith("pl-pzp-")
          ),
          `${scenario.id}: ${value.evidenceIds.join(",")}`
        ).toBe(true);
      }
    }
  });
});

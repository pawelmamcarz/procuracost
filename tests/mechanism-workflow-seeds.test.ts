import { describe, expect, it } from "vitest";

import { modelV2T } from "@/lib/i18n";
import * as modelV2 from "@/lib/model-v2";
import {
  SCENARIOS_V2,
  type ScenarioV2Id,
} from "@/lib/model-v2/scenarios";

type ActivitySeed = {
  kind: "activity";
  id: string;
  formalDays: number;
  adaptiveDays: number;
  roleHours: Record<string, number>;
};

type LegalSlotSeed = {
  kind: "legal_wait_slot";
  slotId: "bid_submission" | "standstill";
};

type MechanismTemplate = {
  steps: readonly (ActivitySeed | LegalSlotSeed)[];
};

const MECHANISM_SCENARIO_IDS = [
  "fleet_tco_reframing",
  "erp_transformation_discovery",
  "logistics_service_redesign",
  "critical_material_continuity",
  "public_it_open_with_market_consultation",
] as const satisfies readonly ScenarioV2Id[];

const EXPECTED_STEP_ORDER = {
  fleet_tco_reframing: [
    "fleet_operating_baseline",
    "fleet_lifecycle_cost_workshop",
    "fleet_use_case_requirements",
    "fleet_market_sounding",
    "fleet_offer_evaluation",
    "fleet_contract_award",
  ],
  erp_transformation_discovery: [
    "erp_current_state_baseline",
    "erp_problem_framing",
    "erp_supplier_discovery",
    "erp_modular_scope",
    "erp_offer_evaluation",
    "erp_contract_award",
  ],
  logistics_service_redesign: [
    "logistics_service_baseline",
    "logistics_market_engagement",
    "logistics_sla_interfaces",
    "logistics_service_requirements",
    "logistics_offer_evaluation",
    "logistics_contract_award",
  ],
  critical_material_continuity: [
    "critical_continuity_risk",
    "critical_supply_mapping",
    "critical_contingency_design",
    "critical_sourcing_strategy",
    "critical_supplier_selection",
    "critical_contract_award",
  ],
  public_it_open_with_market_consultation: [
    "public_it_needs_definition",
    "public_it_preliminary_market_consultation",
    "public_it_consultation_synthesis",
    "public_it_procurement_documents",
    "legal:bid_submission",
    "public_it_bid_evaluation",
    "public_it_clarifications",
    "public_it_award_committee",
    "legal:standstill",
    "public_it_contract_signing",
  ],
} as const;

const EXPECTED_MATERIALIZED_NONLEGAL_TOTALS = {
  fleet_tco_reframing: { formalSequential: 44, adaptiveCompliant: 24 },
  erp_transformation_discovery: {
    formalSequential: 50.6,
    adaptiveCompliant: 27.6,
  },
  logistics_service_redesign: {
    formalSequential: 44,
    adaptiveCompliant: 24,
  },
  critical_material_continuity: {
    formalSequential: 61.6,
    adaptiveCompliant: 33.6,
  },
  public_it_open_with_market_consultation: {
    formalSequential: 42,
    adaptiveCompliant: 26,
  },
} as const;

function mechanismSurface() {
  return modelV2 as typeof modelV2 & {
    MECHANISM_WORKFLOW_EVIDENCE_ID?: string;
    MECHANISM_WORKFLOW_SCENARIO_IDS?: readonly ScenarioV2Id[];
    MECHANISM_WORKFLOW_SOURCE?: Record<string, unknown>;
    MECHANISM_WORKFLOW_TEMPLATES?: Partial<
      Record<ScenarioV2Id, MechanismTemplate>
    >;
  };
}

function expectDeeplyFrozen(value: unknown, path = "root"): void {
  if (!value || typeof value !== "object") return;
  expect(Object.isFrozen(value), path).toBe(true);
  for (const [key, child] of Object.entries(value)) {
    expectDeeplyFrozen(child, `${path}.${key}`);
  }
}

function rawStepId(step: ActivitySeed | LegalSlotSeed): string {
  return step.kind === "activity" ? step.id : `legal:${step.slotId}`;
}

describe("model 2.3 mechanism workflow seeds", () => {
  it("publishes one ordered, deeply frozen registry with explicit internal provenance", () => {
    const surface = mechanismSurface();

    expect(surface.MECHANISM_WORKFLOW_SCENARIO_IDS).toEqual(
      MECHANISM_SCENARIO_IDS
    );
    expect(surface.MECHANISM_WORKFLOW_EVIDENCE_ID).toBe(
      "model_2_3_mechanism_workflow_allocations"
    );
    expect(surface.MECHANISM_WORKFLOW_SOURCE).toMatchObject({
      kind: "internal_model_record",
      modelVersion: "2.3.0",
      evidenceClass: "illustrative_scenario",
      evidenceId: "model_2_3_mechanism_workflow_allocations",
    });
    expect(Object.keys(surface.MECHANISM_WORKFLOW_TEMPLATES ?? {})).toEqual(
      MECHANISM_SCENARIO_IDS
    );
    expectDeeplyFrozen(
      surface.MECHANISM_WORKFLOW_SOURCE,
      "MECHANISM_WORKFLOW_SOURCE"
    );
    expectDeeplyFrozen(
      surface.MECHANISM_WORKFLOW_TEMPLATES,
      "MECHANISM_WORKFLOW_TEMPLATES"
    );
  });

  it("uses mechanism-specific order, preserved aggregate days and a visible trade-off in every pair", () => {
    const templates = mechanismSurface().MECHANISM_WORKFLOW_TEMPLATES;
    expect(templates).toBeDefined();
    if (!templates) return;

    const activityIds: string[] = [];
    for (const scenarioId of MECHANISM_SCENARIO_IDS) {
      const template = templates[scenarioId];
      expect(template, scenarioId).toBeDefined();
      if (!template) continue;

      expect(template.steps.map(rawStepId), scenarioId).toEqual(
        EXPECTED_STEP_ORDER[scenarioId]
      );
      const activities = template.steps.filter(
        (step): step is ActivitySeed => step.kind === "activity"
      );
      activityIds.push(...activities.map(({ id }) => id));
      expect(
        activities.reduce((total, step) => total + step.formalDays, 0),
        `${scenarioId}.formalDays`
      ).toBe(
        scenarioId === "public_it_open_with_market_consultation" ? 42 : 44
      );
      expect(
        activities.reduce((total, step) => total + step.adaptiveDays, 0),
        `${scenarioId}.adaptiveDays`
      ).toBe(
        scenarioId === "public_it_open_with_market_consultation" ? 26 : 24
      );
      expect(
        activities.some(
          ({ formalDays, adaptiveDays }) => adaptiveDays > formalDays
        ),
        `${scenarioId}: adaptive investment`
      ).toBe(true);
      expect(
        activities.some(
          ({ formalDays, adaptiveDays }) => adaptiveDays < formalDays
        ),
        `${scenarioId}: adaptive compression`
      ).toBe(true);
    }

    expect(new Set(activityIds).size).toBe(activityIds.length);
  });

  it("materialises unique bilingual steps as illustrative allocations without changing legal waits", () => {
    const evidenceId = mechanismSurface().MECHANISM_WORKFLOW_EVIDENCE_ID;
    expect(evidenceId).toBeDefined();
    const generatedActivityIds: string[] = [];

    for (const scenarioId of MECHANISM_SCENARIO_IDS) {
      const scenario = SCENARIOS_V2.find(({ id }) => id === scenarioId)!;
      const alternatives = scenario.calculationInput.alternatives;

      for (const alternativeId of [
        "formalSequential",
        "adaptiveCompliant",
      ] as const) {
        const activities = alternatives[
          alternativeId
        ].workflowDesign.steps.filter(({ kind }) => kind !== "legal_wait");
        generatedActivityIds.push(...activities.map(({ id }) => id));
        expect(
          activities.reduce(
            (total, step) => total + step.activeDays.central,
            0
          ),
          `${scenarioId}.${alternativeId}`
        ).toBeCloseTo(
          EXPECTED_MATERIALIZED_NONLEGAL_TOTALS[scenarioId][alternativeId],
          10
        );

        for (const step of activities) {
          expect(step.id, `${scenarioId}.${alternativeId}`).toMatch(
            new RegExp(`^${scenarioId}\\.${alternativeId}\\.`)
          );
          expect(modelV2T.pl.workflow.steps).toHaveProperty(
            step.labelKey.replace("workflow.steps.", "")
          );
          expect(modelV2T.en.workflow.steps).toHaveProperty(
            step.labelKey.replace("workflow.steps.", "")
          );
          for (const value of [
            step.activeDays,
            step.queueDays,
            step.nonLabourCost,
            ...Object.values(step.roleHours),
          ]) {
            expect(value.evidenceClass, `${step.id}`).toBe(
              "illustrative_scenario"
            );
            expect(value.evidenceIds, `${step.id}`).toEqual([
              evidenceId,
              `scenario.${scenarioId}.retained-legacy`,
            ]);
          }
        }
      }
    }

    expect(new Set(generatedActivityIds).size).toBe(
      generatedActivityIds.length
    );

    const publicScenario = SCENARIOS_V2.find(
      ({ id }) => id === "public_it_open_with_market_consultation"
    )!;
    const legalSteps = (alternativeId: "formalSequential" | "adaptiveCompliant") =>
      publicScenario.calculationInput.alternatives[
        alternativeId
      ].workflowDesign.steps
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
    expect(legalSteps("formalSequential").map(({ id }) => id)).toEqual([
      "legal.pzp_open.bid_submission",
      "legal.pzp_open.standstill",
    ]);
  });

  it("keeps fleet TCO allocation neutral despite the lifecycle-cost workshop", () => {
    const fleet = SCENARIOS_V2.find(
      ({ id }) => id === "fleet_tco_reframing"
    )!;
    expect(fleet.economicAssumptions.tcoDifferential).toMatchObject({
      low: 0,
      central: 0,
      high: 0,
    });
    for (const alternative of Object.values(
      fleet.calculationInput.alternatives
    )) {
      expect(
        alternative.contractDesign.dimensions.find(
          ({ id }: { id: string }) => id === "tco"
        )
      ).toMatchObject({
        status: "monetized",
        cost: { low: 0, central: 0, high: 0 },
      });
    }
    expect(modelV2T.pl.scenarios.fleet_tco_reframing.description).toContain(
      "bez monetyzowanej różnicy TCO"
    );
    expect(modelV2T.en.scenarios.fleet_tco_reframing.description).toContain(
      "without a monetised TCO difference"
    );
  });

  it("states the mixed retained and illustrative boundary in parallel PL and EN scenario copy", () => {
    for (const scenarioId of MECHANISM_SCENARIO_IDS) {
      const polish = modelV2T.pl.scenarios[scenarioId].assumptionDetail;
      const english = modelV2T.en.scenarios[scenarioId].assumptionDetail;

      expect(polish, `${scenarioId}.pl`).toContain(
        "alokacje godzin ról są ilustracyjnymi założeniami modelu 2.3"
      );
      expect(english, `${scenarioId}.en`).toContain(
        "role-hour allocations are illustrative model 2.3 assumptions"
      );
      expect(polish, `${scenarioId}.pl`).toContain(
        "Zewnętrzne studia przypadków wspierają wyłącznie nazwane mechanizmy"
      );
      expect(english, `${scenarioId}.en`).toContain(
        "External case studies support only the named mechanisms"
      );
      expect(polish, `${scenarioId}.pl`).not.toMatch(
        /przebieg procesu (?:jest|są|zachowano).*2\.2\.2/i
      );
      expect(english, `${scenarioId}.en`).not.toMatch(
        /workflow (?:is|and workflow are|times remain).*2\.2\.2/i
      );
    }
  });
});

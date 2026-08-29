import { describe, expect, it } from "vitest";

import {
  RETAINED_SUPPORT_PROFILES,
  RETAINED_WORKFLOW_SOURCE,
  RETAINED_WORKFLOW_TEMPLATE_IDS,
  RETAINED_WORKFLOW_TEMPLATES,
} from "@/lib/model-v2/retained-workflow-seeds";

function expectDeeplyFrozen(value: unknown, path = "root"): void {
  if (!value || typeof value !== "object") return;
  expect(Object.isFrozen(value), `${path} must be frozen`).toBe(true);
  for (const [key, nested] of Object.entries(value)) {
    expectDeeplyFrozen(nested, `${path}.${key}`);
  }
}

describe("model 2.3 retained workflow seeds", () => {
  it("identifies the immutable model 2.2.2 source snapshot", () => {
    expect(RETAINED_WORKFLOW_SOURCE).toEqual({
      kind: "retained_workflow_seed",
      sourceModelVersion: "2.2.2",
      sourceCommit: "22c584a0ec9c871a75195257821d5815cfbd52e3",
      evidenceClass: "retained_legacy_assumption",
    });
  });

  it("contains only the seven reviewed workflow families in stable order", () => {
    expect(RETAINED_WORKFLOW_TEMPLATE_IDS).toEqual([
      "strategic_private_formal",
      "pzp_open",
      "policy_control",
      "capex_replacement",
      "discovery_codesign",
      "catalog_calloff",
      "mrp_release",
    ]);
    expect(Object.keys(RETAINED_WORKFLOW_TEMPLATES)).toEqual(
      RETAINED_WORKFLOW_TEMPLATE_IDS
    );
    expect(
      Object.values(RETAINED_WORKFLOW_TEMPLATES).flatMap(({ steps }) => steps)
    ).toHaveLength(37);
  });

  it("keeps legal positions as slots without copying legal rules or day values", () => {
    const legalSlots = Object.values(RETAINED_WORKFLOW_TEMPLATES)
      .flatMap(({ steps }) => steps)
      .filter(({ kind }) => kind === "legal_wait_slot");

    expect(legalSlots).toEqual([
      { kind: "legal_wait_slot", slotId: "bid_submission" },
      { kind: "legal_wait_slot", slotId: "standstill" },
    ]);
    for (const slot of legalSlots) {
      expect(Object.keys(slot).sort()).toEqual(["kind", "slotId"]);
    }
  });

  it("retains only the four support assumptions used to materialise workflows", () => {
    expect(RETAINED_SUPPORT_PROFILES).toEqual({
      manual: {
        timeMultiplier: 1.4,
        coordinationCostPerActiveDay: 500,
        toolCostPerSourcingEvent: 0,
        toolCostPerOperationalOrder: 0,
      },
      sourcing_platform: {
        timeMultiplier: 1.15,
        coordinationCostPerActiveDay: 200,
        toolCostPerSourcingEvent: 800,
        toolCostPerOperationalOrder: 30,
      },
      transactional_erp: {
        timeMultiplier: 1,
        coordinationCostPerActiveDay: 100,
        toolCostPerSourcingEvent: 1_200,
        toolCostPerOperationalOrder: 50,
      },
      integrated_source_to_pay: {
        timeMultiplier: 0.7,
        coordinationCostPerActiveDay: 20,
        toolCostPerSourcingEvent: 2_000,
        toolCostPerOperationalOrder: 60,
      },
    });
  });

  it("does not carry obsolete scoring, threshold, bypass or context controls", () => {
    const source = JSON.stringify({
      source: RETAINED_WORKFLOW_SOURCE,
      templates: RETAINED_WORKFLOW_TEMPLATES,
      support: RETAINED_SUPPORT_PROFILES,
    });

    expect(source).not.toMatch(
      /bypass|threshold|policyRigidity|spendType|processPhase|ruleId|provision|lockedQueueDays/
    );
  });

  it("cannot be mutated through any exported seed reference", () => {
    expectDeeplyFrozen(RETAINED_WORKFLOW_SOURCE, "source");
    expectDeeplyFrozen(RETAINED_WORKFLOW_TEMPLATE_IDS, "templateIds");
    expectDeeplyFrozen(RETAINED_WORKFLOW_TEMPLATES, "templates");
    expectDeeplyFrozen(RETAINED_SUPPORT_PROFILES, "supportProfiles");
  });
});

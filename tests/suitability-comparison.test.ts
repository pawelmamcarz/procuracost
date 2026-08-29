import { describe, expect, it } from "vitest";

import { suitabilityT } from "@/lib/i18n";
import {
  BUYER_REGIME_IDS,
  COMMUNICATION_METHOD_IDS,
  EXECUTION_CHANNEL_IDS,
  LEGAL_GOVERNANCE_BOUNDARY_IDS,
  MODEL_V2_METADATA,
  PROCEDURE_CANDIDATES_BY_BOUNDARY,
  PROCEDURE_FAMILY_IDS,
  PROCUREMENT_OBJECT_IDS,
  PURCHASE_ARCHETYPE_IDS,
  SUITABILITY_CRITERION_IDS,
  SYSTEM_SUPPORT_IDS,
  compareProcedureSuitability,
  type SuitabilityProfileV2,
} from "@/lib/model-v2";
import { resolveSuitabilityCopyKey } from "@/lib/suitability-copy";

function base(
  overrides: Record<string, unknown> = {}
): SuitabilityProfileV2 {
  return {
    ...MODEL_V2_METADATA,
    boundaryId: "private_policy",
    purchaseArchetypeId: "incomplete_requirement",
    executionChannelId: "sourcing_event",
    systemSupportId: "manual",
    initiatedOn: "2026-08-28",
    ...overrides,
  } as SuitabilityProfileV2;
}

const EXPECTED = {
  private_policy: [
    "private_competitive",
    "private_negotiated",
    "framework_calloff",
    "custom_lawful",
  ],
  public_internal_rules: [
    "public_internal_competitive",
    "framework_calloff",
    "custom_lawful",
  ],
  pzp_classic_national: ["pzp_basic", "framework_calloff"],
  pzp_classic_eu: ["pzp_open", "pzp_restricted", "framework_calloff"],
} as const;

describe("model 2.3 procedure suitability comparison", () => {
  it.each(Object.entries(EXPECTED))(
    "returns the exact equal-status candidate set for %s",
    (boundaryId, expected) => {
      const pzp = boundaryId.startsWith("pzp_");
      const result = compareProcedureSuitability(
        base({
          boundaryId,
          buyerRegime: pzp ? "classic" : undefined,
          procurementObject: pzp ? "supplies_services" : undefined,
          communicationMethod: pzp ? "electronic" : undefined,
        })
      );

      expect(result.status).toBe("ready");
      expect(result.candidates.map(({ procedureFamilyId }) => procedureFamilyId))
        .toEqual(expected);
      expect(
        result.candidates.every(
          ({ criteria }) =>
            criteria.map(({ id }) => id).join("|") ===
            SUITABILITY_CRITERION_IDS.join("|")
        )
      ).toBe(true);
      expect(result).not.toHaveProperty("winner");
      expect(result).not.toHaveProperty("recommendation");
      expect(result).not.toHaveProperty("score");
    }
  );

  it("exposes one immutable legal candidate catalogue", () => {
    expect(PROCEDURE_CANDIDATES_BY_BOUNDARY).toEqual(EXPECTED);
    expect(Object.isFrozen(PROCEDURE_CANDIDATES_BY_BOUNDARY)).toBe(true);
    for (const candidates of Object.values(PROCEDURE_CANDIDATES_BY_BOUNDARY)) {
      expect(Object.isFrozen(candidates)).toBe(true);
    }
    expect(Object.isFrozen(SUITABILITY_CRITERION_IDS)).toBe(true);
  });

  it("keeps candidate membership and legal waits independent of system support", () => {
    const outputs = [
      "manual",
      "sourcing_platform",
      "transactional_erp",
      "integrated_source_to_pay",
    ].map((systemSupportId) =>
      compareProcedureSuitability(
        base({
          boundaryId: "pzp_classic_eu",
          buyerRegime: "classic",
          procurementObject: "supplies_services",
          communicationMethod: "electronic",
          systemSupportId,
        })
      )
    );

    expect(outputs.every(({ status }) => status === "ready")).toBe(true);
    const legalProjection = outputs.map(({ candidates }) =>
      candidates.map(({ procedureFamilyId, legalWaits }) => ({
        procedureFamilyId,
        legalWaits,
      }))
    );
    expect(legalProjection.every((value) =>
      JSON.stringify(value) === JSON.stringify(legalProjection[0])
    )).toBe(true);
    expect(outputs.map((output) =>
      output.status === "ready" ? output.profile.systemSupportId : null
    )).toEqual([
      "manual",
      "sourcing_platform",
      "transactional_erp",
      "integrated_source_to_pay",
    ]);
  });

  it.each([
    ["null input", null],
    ["array input", []],
    ["unknown boundary", base({ boundaryId: "__proto__" })],
    ["unknown archetype", base({ purchaseArchetypeId: "unknown" })],
    ["unknown channel", base({ executionChannelId: "unknown" })],
    ["unknown support", base({ systemSupportId: "unknown" })],
    ["unknown buyer regime", base({ buyerRegime: "unknown" })],
    ["unknown object", base({ procurementObject: "unknown" })],
    ["unknown communication", base({ communicationMethod: "unknown" })],
    ["missing date", base({ initiatedOn: undefined })],
    ["invalid date", base({ initiatedOn: "2026-02-31" })],
    ["uncovered date", base({ initiatedOn: "2028-01-01" })],
    ["wrong schema", base({ schemaVersion: 1 })],
    ["wrong model", base({ modelVersion: "2.2.2" })],
    ["wrong calibration", base({ calibrationId: "other" })],
    ["wrong ruleset", base({ legalRulesetId: "other" })],
  ])("fails closed without throwing for %s", (_label, input) => {
    expect(() => compareProcedureSuitability(input)).not.toThrow();
    expect(compareProcedureSuitability(input)).toMatchObject({
      status: "out_of_scope",
      candidates: [],
    });
  });

  it("fails closed for missing, null, array and object values on every required field", () => {
    const required = [
      "schemaVersion",
      "modelVersion",
      "calibrationId",
      "legalRulesetId",
      "boundaryId",
      "purchaseArchetypeId",
      "executionChannelId",
      "systemSupportId",
      "initiatedOn",
    ] as const;
    for (const key of required) {
      for (const value of [undefined, null, [], {}]) {
        const result = compareProcedureSuitability(base({ [key]: value }));
        expect(result.status, `${key}: ${String(value)}`).toBe("out_of_scope");
        expect(result.candidates, `${key}: ${String(value)}`).toEqual([]);
      }
    }
  });

  it.each(["sectoral", "defence_security"])(
    "withholds all candidates for the %s regime",
    (buyerRegime) => {
      expect(
        compareProcedureSuitability(
          base({
            boundaryId: "pzp_classic_eu",
            buyerRegime,
            procurementObject: "supplies_services",
            communicationMethod: "electronic",
          })
        )
      ).toMatchObject({
        status: "out_of_scope",
        reasonKey: "suitability.reasons.unsupportedBuyerRegime",
        candidates: [],
      });
    }
  );

  it.each([
    { buyerRegime: undefined },
    { buyerRegime: "classic", procurementObject: undefined },
    {
      buyerRegime: "classic",
      procurementObject: "supplies_services",
      communicationMethod: undefined,
    },
  ])("withholds PZP candidates when a required declaration is missing", (fields) => {
    const result = compareProcedureSuitability(
      base({
        boundaryId: "pzp_classic_national",
        ...fields,
      })
    );
    expect(result).toMatchObject({
      status: "out_of_scope",
      reasonKey: "suitability.reasons.missingPzpDeclaration",
      candidates: [],
    });
  });

  it("rejects a classic declaration attached to a private boundary", () => {
    expect(
      compareProcedureSuitability(
        base({
          boundaryId: "private_policy",
          buyerRegime: "classic",
          procurementObject: "supplies_services",
          communicationMethod: "electronic",
        })
      )
    ).toMatchObject({
      status: "out_of_scope",
      reasonKey: "suitability.reasons.incompatibleDeclaration",
      candidates: [],
    });
  });

  it("returns recursively immutable results", () => {
    const result = compareProcedureSuitability(base({}));
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.candidates)).toBe(true);
    expect(result.status).toBe("ready");
    if (result.status !== "ready") throw new Error("fixture must be ready");
    expect(Object.isFrozen(result.profile)).toBe(true);
    expect(Object.isFrozen(result.candidates[0])).toBe(true);
    expect(Object.isFrozen(result.candidates[0].legalWaits)).toBe(true);
  });

  it("reports exact legal waits and locked provenance without ranking candidates", () => {
    const national = compareProcedureSuitability(
      base({
        boundaryId: "pzp_classic_national",
        buyerRegime: "classic",
        procurementObject: "supplies_services",
        communicationMethod: "electronic",
      })
    );
    const eu = compareProcedureSuitability(
      base({
        boundaryId: "pzp_classic_eu",
        buyerRegime: "classic",
        procurementObject: "supplies_services",
        communicationMethod: "electronic",
      })
    );
    expect(national.status).toBe("ready");
    expect(eu.status).toBe("ready");
    if (national.status !== "ready" || eu.status !== "ready") return;

    expect(
      national.candidates.map(({ procedureFamilyId, legalWaits }) => ({
        procedureFamilyId,
        days: legalWaits.map(({ queueDays }) => queueDays.central),
      }))
    ).toEqual([
      { procedureFamilyId: "pzp_basic", days: [7, 5] },
      { procedureFamilyId: "framework_calloff", days: [] },
    ]);
    expect(
      eu.candidates.map(({ procedureFamilyId, legalWaits }) => ({
        procedureFamilyId,
        days: legalWaits.map(({ queueDays }) => queueDays.central),
      }))
    ).toEqual([
      { procedureFamilyId: "pzp_open", days: [35, 10] },
      { procedureFamilyId: "pzp_restricted", days: [30, 30, 10] },
      { procedureFamilyId: "framework_calloff", days: [] },
    ]);
    expect(
      national.candidates[0].legalWaits.map((wait) => ({
        ruleId: wait.provenance.ruleId,
        provision: wait.provenance.provision,
        evidenceIds: wait.queueDays.evidenceIds,
      }))
    ).toEqual([
      {
        ruleId: "pl-pzp-art-283",
        provision: "PZP art. 283",
        evidenceIds: ["pl-pzp-art-283"],
      },
      {
        ruleId: "pl-pzp-art-308-2",
        provision: "PZP art. 308 ust. 2",
        evidenceIds: ["pl-pzp-art-308-2"],
      },
    ]);
    expect(
      eu.candidates[1].legalWaits.map((wait) => ({
        ruleId: wait.provenance.ruleId,
        provision: wait.provenance.provision,
        evidenceIds: wait.queueDays.evidenceIds,
      }))
    ).toEqual([
      {
        ruleId: "pl-pzp-art-144-1",
        provision: "PZP art. 144 ust. 1",
        evidenceIds: ["pl-pzp-art-144-1"],
      },
      {
        ruleId: "pl-pzp-art-151-1",
        provision: "PZP art. 151 ust. 1",
        evidenceIds: ["pl-pzp-art-151-1"],
      },
      {
        ruleId: "pl-pzp-art-264-1",
        provision: "PZP art. 264 ust. 1",
        evidenceIds: ["pl-pzp-art-264-1"],
      },
    ]);
    for (const wait of [...national.candidates, ...eu.candidates].flatMap(
      ({ legalWaits }) => legalWaits
    )) {
      expect(wait.queueDays.rangeKind).toBe("fixed");
      expect(wait.provenance).toMatchObject({
        legalRulesetId: MODEL_V2_METADATA.legalRulesetId,
        initiatedOn: "2026-08-28",
        lockedActiveDays: 0,
        lockedQueueDays: wait.queueDays.central,
      });
    }
  });

  it("uses localised special-procedure keys only for validated classic-PZP results", () => {
    const privateResult = compareProcedureSuitability(base());
    const eu = compareProcedureSuitability(
      base({
        boundaryId: "pzp_classic_eu",
        buyerRegime: "classic",
        procurementObject: "supplies_services",
        communicationMethod: "electronic",
      })
    );
    const invalid = compareProcedureSuitability(base({ boundaryId: "unknown" }));
    expect(privateResult.withheldProcedureKeys).toEqual([]);
    expect(invalid.withheldProcedureKeys).toEqual([]);
    expect(eu.withheldProcedureKeys).toEqual([
      "suitability.withheld.competitive_dialogue",
      "suitability.withheld.negotiation_with_notice",
      "suitability.withheld.innovation_partnership",
      "suitability.withheld.direct_award",
    ]);
  });

  it("describes six non-numeric conditions with the approved state semantics", () => {
    const result = compareProcedureSuitability(base());
    expect(result.status).toBe("ready");
    if (result.status !== "ready") return;
    const negotiated = result.candidates.find(
      ({ procedureFamilyId }) => procedureFamilyId === "private_negotiated"
    )!;
    const custom = result.candidates.find(
      ({ procedureFamilyId }) => procedureFamilyId === "custom_lawful"
    )!;
    expect(negotiated.criteria.map(({ id, state }) => [id, state])).toEqual([
      ["legal_boundary", "condition_to_verify"],
      ["requirement_definition", "condition_present"],
      ["competition_access", "condition_to_verify"],
      ["execution_channel", "condition_present"],
      ["workflow_learning", "condition_to_verify"],
      ["system_support", "condition_to_verify"],
    ]);
    expect(
      custom.criteria.find(({ id }) => id === "competition_access")?.state
    ).toBe("not_assessed");
    expect(custom.limitationKeys).toContain(
      "suitability.limitations.customGroundsNotEvaluated"
    );
    expect(negotiated.conditionKeys).toContain(
      "suitability.conditions.learningMayAddWork"
    );
  });

  it("keeps catalogue and MRP channels bounded to existing arrangements", () => {
    for (const executionChannelId of ["catalog_calloff", "mrp_release"] as const) {
      const result = compareProcedureSuitability(
        base({ executionChannelId, purchaseArchetypeId: "standardized_recurring" })
      );
      expect(result.status).toBe("ready");
      if (result.status !== "ready") continue;
      for (const candidate of result.candidates) {
        expect(
          candidate.criteria.find(({ id }) => id === "execution_channel")
            ?.detailKey
        ).toBe(`suitability.criteria.execution_channel.${executionChannelId}`);
      }
      expect(
        result.candidates.find(
          ({ procedureFamilyId }) => procedureFamilyId === "framework_calloff"
        )?.conditionKeys
      ).toContain("suitability.conditions.frameworkApplicable");
    }
  });

  it("contains no recursive scoring, recommendation or confidence fields", () => {
    const result = compareProcedureSuitability(base());
    const forbidden = new Set([
      "score",
      "totalScore",
      "rank",
      "ranking",
      "topPath",
      "winner",
      "optimal",
      "recommendation",
      "recommended",
      "confidence",
      "votes",
      "treeVotes",
      "weightStability",
    ]);
    function visit(value: unknown): void {
      if (!value || typeof value !== "object") return;
      for (const [key, child] of Object.entries(value)) {
        expect(forbidden.has(key), key).toBe(false);
        visit(child);
      }
    }
    visit(result);
  });

  it.each([
    ["standardized_recurring", "not_assessed"],
    ["continuity_critical", "not_assessed"],
    ["incomplete_requirement", "condition_to_verify"],
    ["complex_service", "condition_to_verify"],
  ] as const)(
    "reports the approved workflow-learning state for %s",
    (purchaseArchetypeId, expectedState) => {
      const result = compareProcedureSuitability(base({ purchaseArchetypeId }));
      expect(result.status).toBe("ready");
      if (result.status !== "ready") return;
      expect(
        result.candidates.every(
          ({ criteria }) =>
            criteria.find(({ id }) => id === "workflow_learning")?.state ===
            expectedState
        )
      ).toBe(true);
    }
  );

  it("resolves every emitted copy key in both languages without a machine-key fallback", () => {
    const keys = new Set<string>([
      "suitability.reasons.invalidInput",
      "suitability.reasons.invalidOrUnsupportedProfile",
      "suitability.reasons.unsupportedBuyerRegime",
      "suitability.reasons.missingPzpDeclaration",
      "suitability.reasons.incompatibleDeclaration",
      "suitability.reasons.legalResolutionFailed",
    ]);

    const profiles: SuitabilityProfileV2[] = [];
    for (const purchaseArchetypeId of PURCHASE_ARCHETYPE_IDS) {
      for (const executionChannelId of EXECUTION_CHANNEL_IDS) {
        for (const systemSupportId of SYSTEM_SUPPORT_IDS) {
          profiles.push(
            base({ purchaseArchetypeId, executionChannelId, systemSupportId })
          );
        }
      }
    }
    profiles.push(
      base({ boundaryId: "public_internal_rules" }),
      base({
        boundaryId: "pzp_classic_national",
        buyerRegime: "classic",
        procurementObject: "supplies_services",
        communicationMethod: "electronic",
      }),
      base({
        boundaryId: "pzp_classic_eu",
        buyerRegime: "classic",
        procurementObject: "works",
        communicationMethod: "other",
      })
    );

    for (const profile of profiles) {
      const result = compareProcedureSuitability(profile);
      expect(result.status).toBe("ready");
      if (result.status !== "ready") continue;
      result.methodLimitationKeys.forEach((key) => keys.add(key));
      result.withheldProcedureKeys.forEach((key) => keys.add(key));
      for (const candidate of result.candidates) {
        keys.add(candidate.labelKey);
        candidate.criteria.forEach(({ detailKey }) => keys.add(detailKey));
        candidate.conditionKeys.forEach((key) => keys.add(key));
        candidate.limitationKeys.forEach((key) => keys.add(key));
        candidate.legalWaits.forEach(({ labelKey }) => keys.add(labelKey));
      }
    }

    for (const lang of ["pl", "en"] as const) {
      for (const key of keys) {
        const resolved = resolveSuitabilityCopyKey(suitabilityT[lang], key);
        expect(resolved, `${lang}: ${key}`).toBeTruthy();
        expect(resolved, `${lang}: ${key}`).not.toBe(key);
        expect(resolved, `${lang}: ${key}`).not.toBe(
          suitabilityT[lang].unavailableText
        );
      }
    }
  });

  it("isolates immutable result graphs between calls without freezing shared metadata", () => {
    const first = compareProcedureSuitability(base());
    const second = compareProcedureSuitability(base());
    expect(first).not.toBe(second);
    expect(first.metadata).not.toBe(second.metadata);
    expect(first.metadata).not.toBe(MODEL_V2_METADATA);
    expect(Object.isFrozen(MODEL_V2_METADATA)).toBe(true);
    expect(first.candidates).not.toBe(second.candidates);
    expect(first.candidates[0]).not.toBe(second.candidates[0]);
  });

  it("keeps every runtime guard registry immutable and rejects attempted forged IDs", () => {
    const registries = [
      LEGAL_GOVERNANCE_BOUNDARY_IDS,
      PROCEDURE_FAMILY_IDS,
      PURCHASE_ARCHETYPE_IDS,
      EXECUTION_CHANNEL_IDS,
      SYSTEM_SUPPORT_IDS,
      BUYER_REGIME_IDS,
      PROCUREMENT_OBJECT_IDS,
      COMMUNICATION_METHOD_IDS,
    ] as const;

    for (const registry of registries) {
      expect(Object.isFrozen(registry)).toBe(true);
      expect(() =>
        (registry as unknown as string[]).push("forged_runtime_id")
      ).toThrow();
    }

    for (const [key, value] of [
      ["boundaryId", "forged_boundary"],
      ["purchaseArchetypeId", "forged_archetype"],
      ["executionChannelId", "forged_channel"],
      ["systemSupportId", "forged_support"],
      ["buyerRegime", "forged_regime"],
      ["procurementObject", "forged_object"],
      ["communicationMethod", "forged_method"],
    ] as const) {
      expect(
        compareProcedureSuitability(base({ [key]: value }))
      ).toMatchObject({ status: "out_of_scope", candidates: [] });
    }
  });
});

import { describe, expect, it } from "vitest";

import {
  calculatorWorkspaceReducer,
  createCalculatorWorkspaceState,
  type CalculatorWorkspaceState,
} from "@/components/calculator-v2/editor-state";
import {
  PROCESS_MAP_VALIDATION_CODES,
  calculatorIssueCopy,
  deriveCalculatorWorkspaceValidation,
  processMapIssueFromEngine,
  submitCalculatorWorkspace,
} from "@/components/calculator-v2/workspace-validation";
import {
  applyLegacyMigrationConfirmation,
  createRenderableCalculatorWorkspaceState,
} from "@/components/calculator-v2/workspace-bootstrap";
import {
  adaptLegacyCalculatorBootstrap,
  bootstrapCalculatorUrl,
} from "@/components/calculator-v2/url-bootstrap";
import { calculatorV2T } from "@/lib/i18n";
import {
  createScenarioDraft,
  decodeV2CalculatorParams,
  encodeV2CalculatorState,
  stateForScenarioV2,
  type AlternativeId,
  type CalibratedValue,
  type ProcessMapValidationCode,
  type ProcessMapValidationIssue,
  type ScenarioDraft,
  type V2CalculatorUrlState,
} from "@/lib/model-v2";

const V2_STATE_FIELDS = [
  "schemaVersion",
  "modelVersion",
  "calibrationId",
  "scenarioId",
  "governanceBoundaryId",
  "procedureFamilyId",
  "purchaseArchetypeId",
  "executionChannelId",
  "systemSupportId",
  "workflowDesignFormalId",
  "workflowDesignAdaptiveId",
  "contractDesignFormalId",
  "contractDesignAdaptiveId",
] as const satisfies readonly (keyof V2CalculatorUrlState)[];

const NON_CANONICAL_V2_VALUES: ReadonlyArray<
  readonly [keyof V2CalculatorUrlState, unknown]
> = [
  ["schemaVersion", 999],
  ["modelVersion", "runtime-model"],
  ["calibrationId", "runtime-calibration"],
  ["scenarioId", "erp_transformation_discovery"],
  ["governanceBoundaryId", "pzp_classic_eu"],
  ["procedureFamilyId", "pzp_open"],
  ["purchaseArchetypeId", "complex_service"],
  ["executionChannelId", "custom"],
  ["systemSupportId", "manual"],
  ["workflowDesignFormalId", "runtime.workflow.formal"],
  ["workflowDesignAdaptiveId", "runtime.workflow.adaptive"],
  ["contractDesignFormalId", "runtime.contract.formal"],
  ["contractDesignAdaptiveId", "runtime.contract.adaptive"],
];

function fixed(value: number): CalibratedValue {
  return {
    low: value,
    central: value,
    high: value,
    rangeKind: "fixed",
    evidenceClass: "user_input",
    evidenceIds: [],
  };
}

function firstEditableId(
  draft: ScenarioDraft,
  alternativeId: AlternativeId = "formalSequential"
): string {
  const step = draft.alternatives[alternativeId].workflowDesign.steps.find(
    (candidate) => !candidate.lockedLegalProvenance
  );
  if (!step) throw new Error("Expected an editable step");
  return step.id;
}

function issueCodes(state: CalculatorWorkspaceState): string[] {
  return deriveCalculatorWorkspaceValidation(state).issues.map(
    ({ code }) => code
  );
}

function exactFleetLegacyParams(): URLSearchParams {
  return new URLSearchParams({
    sid: "fleet",
    pt: "private_formal",
    tl: "partial_erp",
    cv: "5000000",
    tco: "2",
    dur: "2",
    dci: "5000",
    rc: "150000",
    bae: "500000",
    sh: "1:900,3:800,1:1200,1:900,1:1500,1:2500",
  });
}

function readyExactLegacy() {
  const bootstrap = bootstrapCalculatorUrl(exactFleetLegacyParams());
  if (
    bootstrap.origin !== "legacy" ||
    bootstrap.adaptation.status !== "ready"
  ) {
    throw new Error("Expected exact ready legacy fixture");
  }
  return bootstrap.adaptation;
}

function readyPartialLegacy() {
  const params = exactFleetLegacyParams();
  params.set("cv", "5100000");
  const bootstrap = bootstrapCalculatorUrl(params);
  if (bootstrap.origin !== "legacy") {
    throw new Error("Expected partial legacy fixture");
  }
  const adaptation = adaptLegacyCalculatorBootstrap(bootstrap.result, true);
  if (adaptation.status !== "ready") {
    throw new Error("Expected confirmed ready partial fixture");
  }
  return adaptation;
}

function validFleetV2Result() {
  const result = decodeV2CalculatorParams(
    encodeV2CalculatorState(stateForScenarioV2("fleet_tco_reframing"))
  );
  if (result.status !== "valid") {
    throw new Error("Expected valid native v2 fixture");
  }
  return structuredClone(result);
}

function stateWithRuntimeV2Result(result: unknown): CalculatorWorkspaceState {
  return createCalculatorWorkspaceState(
    createScenarioDraft("fleet_tco_reframing"),
    {
      urlOrigin: "v2",
      urlGate: {
        kind: "v2_url",
        result,
      } as unknown as NonNullable<CalculatorWorkspaceState["urlGate"]>,
    }
  );
}

function expectSourceBlockedWithoutThrow(state: CalculatorWorkspaceState): void {
  let validation: ReturnType<typeof deriveCalculatorWorkspaceValidation> | undefined;
  expect(() => {
    validation = deriveCalculatorWorkspaceValidation(state);
  }).not.toThrow();
  expect(validation).toMatchObject({ canSubmit: false });
  expect(validation?.issues).toContainEqual(
    expect.objectContaining({
      source: "workspace-source",
      code: "incoherent_workspace_source",
    })
  );
  expect(submitCalculatorWorkspace(state).status).toBe("blocked");
}

describe("calculator workspace validation and submit contract", () => {
  it("maps every process-map validation code to paired actionable PL and EN copy", () => {
    for (const code of PROCESS_MAP_VALIDATION_CODES) {
      const engineIssue: ProcessMapValidationIssue = {
        code,
        stepId: "step-a",
        message: `RAW ENGINE MESSAGE ${code}`,
      };
      const issue = processMapIssueFromEngine(
        engineIssue,
        "formalSequential",
        { predecessorId: "missing-step" }
      );

      expect(issue).not.toHaveProperty("message");
      expect(issue.messageKey).toBe(
        `calculatorV2.validation.processMap.${code}`
      );
      for (const lang of ["pl", "en"] as const) {
        const copy = calculatorIssueCopy(issue, lang);
        expect(copy).toBe(calculatorV2T[lang].validation.processMap[code]);
        expect(copy).not.toContain("RAW ENGINE MESSAGE");
        expect(copy.length).toBeGreaterThan(20);
      }
    }
  });

  it.each([
    "duplicate_step",
    "unknown_predecessor",
    "cycle",
    "invalid_value",
    "invalid_locked_legal_wait",
    "missing_locked_legal_wait",
    "unexpected_locked_legal_wait",
  ] satisfies ProcessMapValidationCode[])(
    "never exposes raw engine .message for %s",
    (code) => {
      const issue = processMapIssueFromEngine(
        { code, stepId: "x", message: "INTERNAL ENGLISH SENTINEL" },
        "adaptiveCompliant"
      );

      expect(JSON.stringify(issue)).not.toContain("INTERNAL ENGLISH SENTINEL");
      expect(calculatorIssueCopy(issue, "pl")).not.toContain(
        "INTERNAL ENGLISH SENTINEL"
      );
      expect(calculatorIssueCopy(issue, "en")).not.toContain(
        "INTERNAL ENGLISH SENTINEL"
      );
    }
  );

  it("combines cycle and unknown-predecessor issues and blocks submission", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    const steps = draft.alternatives.formalSequential.workflowDesign.steps;
    steps[0].predecessorIds = [steps.at(-1)!.id, "missing-step"];
    const state = createCalculatorWorkspaceState(draft);

    const validation = deriveCalculatorWorkspaceValidation(state);

    expect(validation.canSubmit).toBe(false);
    expect(validation.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "process-map",
          code: "cycle",
          alternativeId: "formalSequential",
        }),
        expect.objectContaining({
          source: "process-map",
          code: "unknown_predecessor",
          alternativeId: "formalSequential",
          predecessorId: "missing-step",
        }),
      ])
    );
  });

  it.each([
    [
      "changed legal lock",
      (draft: ScenarioDraft) => {
        const locked = draft.alternatives.formalSequential.workflowDesign.steps.find(
          (step) => step.lockedLegalProvenance
        )!;
        locked.queueDays.central += 1;
      },
      "invalid_locked_legal_wait",
    ],
    [
      "invalid calibrated range",
      (draft: ScenarioDraft) => {
        const step = draft.alternatives.formalSequential.workflowDesign.steps[0];
        step.activeDays = { ...fixed(2), low: 3 };
      },
      "invalid_calibrated_range",
    ],
    [
      "illegal context",
      (draft: ScenarioDraft) => {
        draft.context.boundaryId = "private_policy";
        draft.context.procedureFamilyId = "pzp_open";
      },
      "illegal_context",
    ],
    [
      "blank custom label",
      (draft: ScenarioDraft) => {
        draft.alternatives.formalSequential.workflowDesign.steps.push({
          ...structuredClone(
            draft.alternatives.formalSequential.workflowDesign.steps[0]
          ),
          id: "user-step-99",
          labelKey: "workflow.steps.userDefined",
          userLabel: "   ",
          predecessorIds: [],
        });
      },
      "blank_custom_label",
    ],
    [
      "incompatible design provenance",
      (draft: ScenarioDraft) => {
        draft.designIds.workflow.formalSequential =
          "erp_transformation_discovery.workflow.formalSequential";
      },
      "incompatible_workflow_design",
    ],
  ] as const)("blocks %s with a typed public issue", (_label, mutate, expectedCode) => {
    const draft = createScenarioDraft(
      expectedCode === "invalid_locked_legal_wait" ||
        expectedCode === "illegal_context"
        ? "public_it_open_with_market_consultation"
        : "fleet_tco_reframing"
    );
    mutate(draft);

    const validation = deriveCalculatorWorkspaceValidation(
      createCalculatorWorkspaceState(draft)
    );

    expect(validation.canSubmit).toBe(false);
    expect(validation.issues).toContainEqual(
      expect.objectContaining({ code: expectedCode })
    );
    expect(validation.issues.every((issue) => !("message" in issue))).toBe(true);
  });

  it("keeps an unknown native URL ID and unconfirmed migration visibly blocked", () => {
    const invalidParams = encodeV2CalculatorState(
      stateForScenarioV2("fleet_tco_reframing")
    );
    invalidParams.set("sid", "not-registered");
    const invalidResult = decodeV2CalculatorParams(invalidParams);
    const urlState = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing"),
      {
        urlOrigin: "v2",
        urlGate: { kind: "v2_url", result: invalidResult },
      }
    );
    const partial = bootstrapCalculatorUrl(new URLSearchParams({ sid: "erp" }));
    if (partial.origin !== "legacy") throw new Error("Expected legacy state");
    const migrationState = createCalculatorWorkspaceState(
      createScenarioDraft("erp_transformation_discovery"),
      {
        urlOrigin: "legacy",
        migration: partial.adaptation,
      }
    );

    expect(issueCodes(urlState)).toContain("unknown_id");
    expect(issueCodes(migrationState)).toContain("confirmation_required");
    expect(deriveCalculatorWorkspaceValidation(urlState).canSubmit).toBe(false);
    expect(
      deriveCalculatorWorkspaceValidation(migrationState).canSubmit
    ).toBe(false);
  });

  it.each([
    ["exact", readyExactLegacy],
    ["partial", readyPartialLegacy],
  ] as const)(
    "blocks a ready %s legacy adaptation when its audited gate is missing",
    (_status, readyMigration) => {
      const migration = readyMigration();
      const state = createCalculatorWorkspaceState(migration.draft, {
        urlOrigin: "legacy",
        migration,
      });

      const validation = deriveCalculatorWorkspaceValidation(state);
      const submitted = submitCalculatorWorkspace(state);

      expect(validation.canSubmit).toBe(false);
      expect(validation.issues).toContainEqual(
        expect.objectContaining({
          source: "workspace-source",
          code: "incoherent_workspace_source",
        })
      );
      expect(submitted.status).toBe("blocked");
      expect(submitted.state.record).toBeNull();
    }
  );

  it.each([
    [
      "empty origin with a v2 gate",
      () => {
        const result = decodeV2CalculatorParams(
          encodeV2CalculatorState(stateForScenarioV2("fleet_tco_reframing"))
        );
        return createCalculatorWorkspaceState(
          createScenarioDraft("fleet_tco_reframing"),
          {
            urlOrigin: "empty",
            urlGate: { kind: "v2_url", result },
          }
        );
      },
    ],
    [
      "v2 origin without a v2 gate",
      () =>
        createCalculatorWorkspaceState(
          createScenarioDraft("fleet_tco_reframing"),
          { urlOrigin: "v2" }
        ),
    ],
    [
      "v2 origin with a legacy adaptation and gate",
      () => {
        const migration = readyExactLegacy();
        return createCalculatorWorkspaceState(migration.draft, {
          urlOrigin: "v2",
          urlGate: migration.gate,
          migration,
        });
      },
    ],
    [
      "v2 origin with a malformed runtime v2 result",
      () =>
        createCalculatorWorkspaceState(
          createScenarioDraft("fleet_tco_reframing"),
          {
            urlOrigin: "v2",
            urlGate: {
              kind: "v2_url",
              result: { status: "runtime_unknown" },
            } as unknown as NonNullable<CalculatorWorkspaceState["urlGate"]>,
          }
        ),
    ],
  ] as const)("fails closed for %s", (_label, stateFactory) => {
    const state = stateFactory();

    expect(issueCodes(state)).toContain("incoherent_workspace_source");
    expect(submitCalculatorWorkspace(state).status).toBe("blocked");
  });

  it.each(NON_CANONICAL_V2_VALUES)(
    "blocks a forged valid v2 result with non-canonical %s",
    (field, value) => {
      const result = validFleetV2Result();
      (result.state as unknown as Record<string, unknown>)[field] = value;

      expectSourceBlockedWithoutThrow(stateWithRuntimeV2Result(result));
    }
  );

  it.each(V2_STATE_FIELDS)(
    "blocks a forged valid v2 result missing %s",
    (field) => {
      const result = validFleetV2Result();
      delete (result.state as unknown as Record<string, unknown>)[field];

      expectSourceBlockedWithoutThrow(stateWithRuntimeV2Result(result));
    }
  );

  it("blocks a forged valid v2 result with an additional state field", () => {
    const result = validFleetV2Result();
    (result.state as unknown as Record<string, unknown>).runtimeExtra = true;

    expectSourceBlockedWithoutThrow(stateWithRuntimeV2Result(result));
  });

  it.each([
    ["null entry", [null]],
    ["non-object entry", ["invalid"]],
    ["missing entry fields", [{}]],
    [
      "unknown error code",
      [
        {
          code: "runtime_code",
          field: "sid",
          value: "x",
          messageKey: "validation.unknownId",
        },
      ],
    ],
    [
      "unknown error field",
      [
        {
          code: "unknown_id",
          field: "runtime_field",
          value: "x",
          messageKey: "validation.unknownId",
        },
      ],
    ],
    [
      "non-string message key",
      [
        {
          code: "unknown_id",
          field: "sid",
          value: "x",
          messageKey: null,
        },
      ],
    ],
    [
      "unknown message key",
      [
        {
          code: "unknown_id",
          field: "sid",
          value: "x",
          messageKey: "validation.runtimeUnknown",
        },
      ],
    ],
    [
      "non-scalar field value",
      [
        {
          code: "unknown_id",
          field: "sid",
          value: { runtime: true },
          messageKey: "validation.unknownScenario",
        },
      ],
    ],
  ] as const)(
    "does not throw and blocks malformed v2 validation errors: %s",
    (_label, validationErrors) => {
      const result = validFleetV2Result() as unknown as Record<string, unknown>;
      result.status = "invalid";
      result.canCalculate = false;
      delete result.state;
      result.validationErrors = structuredClone(validationErrors);

      expectSourceBlockedWithoutThrow(stateWithRuntimeV2Result(result));
    }
  );

  it("requires a ready legacy adaptation to match its gate and fresh adapter result", () => {
    const migration = readyExactLegacy();
    const state = createCalculatorWorkspaceState(migration.draft, {
      urlOrigin: "legacy",
      urlGate: migration.gate,
      migration,
    });
    if (state.migration?.status !== "ready") {
      throw new Error("Expected ready state migration");
    }
    state.migration.audit.retainedLegacyInputs.contractValue += 1;

    expect(issueCodes(state)).toContain("incoherent_workspace_source");
    expect(submitCalculatorWorkspace(state).status).toBe("blocked");
  });

  it("keeps a runtime-forged blocked legacy source non-calculable", () => {
    const bootstrap = bootstrapCalculatorUrl(
      new URLSearchParams({ sid: "not-registered" })
    );
    if (bootstrap.origin !== "legacy") {
      throw new Error("Expected blocked legacy fixture");
    }
    const migration = {
      ...structuredClone(bootstrap.adaptation),
      issues: [],
    } as typeof bootstrap.adaptation;
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing"),
      {
        urlOrigin: "legacy",
        migration,
      }
    );

    expect(issueCodes(state)).toContain("incoherent_workspace_source");
    expect(submitCalculatorWorkspace(state).status).toBe("blocked");
  });

  it.each(["legal_wait", "runtime_unknown"])(
    "blocks an unlocked runtime draft step kind %s",
    (kind) => {
      const draft = createScenarioDraft("fleet_tco_reframing");
      const step = draft.alternatives.formalSequential.workflowDesign.steps.find(
        (candidate) => !candidate.lockedLegalProvenance
      );
      if (!step) throw new Error("Expected an editable step");
      step.kind = kind as typeof step.kind;
      const state = createCalculatorWorkspaceState(draft);

      const validation = deriveCalculatorWorkspaceValidation(state);

      expect(validation.canSubmit).toBe(false);
      expect(validation.issues).toContainEqual(
        expect.objectContaining({
          source: "editor",
          code: "invalid_step_kind",
          alternativeId: "formalSequential",
          stepId: step.id,
          field: "kind",
        })
      );
      expect(submitCalculatorWorkspace(state).status).toBe("blocked");
    }
  );

  it("confirms, edits and submits a partial legacy workspace with eight model-derived edits", () => {
    const bootstrap = bootstrapCalculatorUrl(
      new URLSearchParams({ sid: "erp" })
    );
    if (bootstrap.origin !== "legacy" || bootstrap.result.status !== "partial") {
      throw new Error("Expected a blocked partial legacy bootstrap");
    }
    let state = createRenderableCalculatorWorkspaceState(bootstrap);
    state = applyLegacyMigrationConfirmation(state, bootstrap.result, true);
    if (state.migration?.status !== "ready") {
      throw new Error("Expected the reviewed adapter to confirm the migration");
    }
    const originalAudit = structuredClone(state.migration.audit);
    const assumptions = structuredClone(state.draft.economicAssumptions);
    assumptions.contractValue = fixed(4_200_000);
    assumptions.dailyCostOfInaction = fixed(12_345);
    state = calculatorWorkspaceReducer(state, {
      type: "replace-economic-assumptions",
      economicAssumptions: assumptions,
    });
    for (const [index, roleId] of [
      "requestor",
      "buyer",
      "lawyer",
      "finance",
      "manager",
      "executive",
    ].entries()) {
      state = calculatorWorkspaceReducer(state, {
        type: "edit-role-hourly-rate",
        roleId,
        value: fixed(201 + index),
      });
    }

    const submitted = submitCalculatorWorkspace(state);

    expect(submitted.status).toBe("submitted");
    expect(submitted.issues).not.toContainEqual(
      expect.objectContaining({ code: "calculation_rejected" })
    );
    if (submitted.status !== "submitted" || !submitted.state.record) {
      throw new Error("Expected a submitted partial migration record");
    }
    expect(submitted.state.record.assumptions.contractValue.central).toBe(
      4_200_000
    );
    expect(submitted.state.record.assumptions.dailyCostOfInaction.central).toBe(
      12_345
    );
    expect(submitted.state.record.roleHourlyRates.executive.central).toBe(206);
    expect(
      submitted.state.record.metadata.migration.postMigrationEdits.map(
        ({ field }) => field
      )
    ).toEqual([
      "contractValue",
      "dailyCostOfInaction",
      "stakeholders.requestor.dailyRate",
      "stakeholders.buyer.dailyRate",
      "stakeholders.lawyer.dailyRate",
      "stakeholders.finance.dailyRate",
      "stakeholders.manager.dailyRate",
      "stakeholders.executive.dailyRate",
    ]);
    expect(submitted.state.record.metadata.migration.audit).toEqual(
      originalAudit
    );
  });

  it("edits and submits an exact legacy workspace without fabricating a migration overlay", () => {
    const bootstrap = bootstrapCalculatorUrl(exactFleetLegacyParams());
    if (bootstrap.origin !== "legacy") {
      throw new Error("Expected an exact legacy bootstrap");
    }
    let state = createRenderableCalculatorWorkspaceState(bootstrap);
    const assumptions = structuredClone(state.draft.economicAssumptions);
    assumptions.contractValue = fixed(5_500_000);
    state = calculatorWorkspaceReducer(state, {
      type: "replace-economic-assumptions",
      economicAssumptions: assumptions,
    });
    state = calculatorWorkspaceReducer(state, {
      type: "edit-role-hourly-rate",
      roleId: "buyer",
      value: fixed(321),
    });

    const submitted = submitCalculatorWorkspace(state);

    expect(submitted.status).toBe("submitted");
    if (submitted.status !== "submitted" || !submitted.state.record) {
      throw new Error("Expected a submitted exact migration record");
    }
    expect(submitted.state.record.metadata.migration).toMatchObject({
      status: "exact",
      postMigrationEdits: [],
    });
    expect(submitted.state.record.assumptions.contractValue.central).toBe(
      5_500_000
    );
    expect(submitted.state.record.roleHourlyRates.buyer.central).toBe(321);
  });

  it("permits a valid native state and atomically creates one decision record with reveal focus", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );

    const validation = deriveCalculatorWorkspaceValidation(state);
    const submitted = submitCalculatorWorkspace(state);

    expect(validation).toEqual({ canSubmit: true, issues: [] });
    expect(submitted.status).toBe("submitted");
    if (submitted.status !== "submitted") throw new Error("Expected submit");
    expect(submitted.state.record).toMatchObject({
      metadata: { scenarioId: "fleet_tco_reframing" },
      comparison: { operation: "formalSequential_minus_adaptiveCompliant" },
    });
    expect(submitted.state.focusTarget).toEqual({ kind: "decision-record" });
    expect(submitted.issues).toEqual([]);
  });

  it("does not create or reveal a result when validation fails or an edit clears it", () => {
    const initial = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const added = calculatorWorkspaceReducer(initial, {
      type: "add-step",
      alternativeId: "formalSequential",
    });
    const blocked = submitCalculatorWorkspace(added);

    expect(blocked.status).toBe("blocked");
    expect(blocked.state.record).toBeNull();
    expect(blocked.state.focusTarget).not.toEqual({ kind: "decision-record" });
    expect(blocked.issues).toContainEqual(
      expect.objectContaining({ code: "blank_custom_label" })
    );

    const valid = submitCalculatorWorkspace(initial);
    if (valid.status !== "submitted") throw new Error("Expected submit");
    const stepId = firstEditableId(valid.state.draft);
    const edited = calculatorWorkspaceReducer(valid.state, {
      type: "edit-step-label",
      alternativeId: "formalSequential",
      stepId,
      userLabel: "Changed after calculation",
    });
    expect(edited.record).toBeNull();
    expect(edited.focusTarget).not.toEqual({ kind: "decision-record" });
  });

  it("uses professional copy rather than camelCase alternative IDs", () => {
    const issue = processMapIssueFromEngine(
      { code: "cycle", stepId: "step-a", message: "cycle" },
      "formalSequential"
    );

    expect(calculatorIssueCopy(issue, "pl")).not.toContain("formalSequential");
    expect(calculatorIssueCopy(issue, "en")).not.toContain("formalSequential");
  });
});

import { describe, expect, it } from "vitest";

import * as localDraftContract from "@/components/calculator-v2/local-draft";
import { createCalculatorWorkspaceState } from "@/components/calculator-v2/editor-state";
import { createScenarioDraft, MODEL_V2_METADATA } from "@/lib/model-v2";

const contract = localDraftContract as unknown as {
  LOCAL_CALCULATOR_DRAFT_KEY: string;
  createLocalCalculatorDraft: (
    state: ReturnType<typeof createCalculatorWorkspaceState>,
    displayNames: {
      formalSequential: string;
      adaptiveCompliant: string;
    },
    activeStage: "case" | "workflows" | "costs" | "record",
    savedAt: string
  ) => Record<string, unknown>;
  parseLocalCalculatorDraft: (raw: string) =>
    | { status: "ready"; draft: Record<string, unknown> }
    | { status: "invalid" | "incompatible" };
  shouldOfferLocalDraft: (origin: "empty" | "v2" | "legacy") => boolean;
};

describe("versioned local calculator draft", () => {
  it("uses the approved versioned browser-storage key", () => {
    expect(contract.LOCAL_CALCULATOR_DRAFT_KEY).toBe(
      "procuracost:calculator-draft:v1"
    );
  });

  it("stores the editable draft and presentation state but no result or transient UI state", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const draft = contract.createLocalCalculatorDraft(
      state,
      {
        formalSequential: "Obecny przebieg",
        adaptiveCompliant: "Wariant pilotażowy",
      },
      "workflows",
      "2026-09-01T15:30:00.000Z"
    );
    const serialised = JSON.stringify(draft);

    expect(Object.keys(draft).sort()).toEqual([
      "activeStage",
      "displayNames",
      "draft",
      "metadata",
      "savedAt",
      "scenarioId",
      "storageVersion",
    ]);
    expect(draft).toMatchObject({
      storageVersion: 1,
      metadata: MODEL_V2_METADATA,
      savedAt: "2026-09-01T15:30:00.000Z",
      scenarioId: "fleet_tco_reframing",
      activeStage: "workflows",
      displayNames: {
        formalSequential: "Obecny przebieg",
        adaptiveCompliant: "Wariant pilotażowy",
      },
    });
    expect(serialised).not.toContain('"record"');
    expect(serialised).not.toContain('"lastRecord"');
    expect(serialised).not.toContain('"issues"');
    expect(serialised).not.toContain('"undo"');
    expect(serialised).not.toContain('"focusTarget"');
  });

  it("parses a compatible draft without sharing mutable references", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const stored = contract.createLocalCalculatorDraft(
      state,
      { formalSequential: "A", adaptiveCompliant: "B" },
      "costs",
      "2026-09-01T15:30:00.000Z"
    );
    const result = contract.parseLocalCalculatorDraft(JSON.stringify(stored));

    expect(result.status).toBe("ready");
    if (result.status !== "ready") throw new Error("Expected ready draft");
    expect(result.draft).toEqual(stored);
    expect(result.draft).not.toBe(stored);
  });

  it("fails closed for incompatible metadata and malformed payloads", () => {
    const state = createCalculatorWorkspaceState(
      createScenarioDraft("fleet_tco_reframing")
    );
    const stored = contract.createLocalCalculatorDraft(
      state,
      { formalSequential: "A", adaptiveCompliant: "B" },
      "case",
      "2026-09-01T15:30:00.000Z"
    );
    const incompatible = structuredClone(stored) as {
      metadata: { modelVersion: string };
    };
    incompatible.metadata.modelVersion = "2.2.2";

    expect(
      contract.parseLocalCalculatorDraft(JSON.stringify(incompatible))
    ).toEqual({ status: "incompatible" });
    expect(contract.parseLocalCalculatorDraft("not-json")).toEqual({
      status: "invalid",
    });
    expect(contract.parseLocalCalculatorDraft("{}")) .toEqual({
      status: "invalid",
    });

    const malformedDraft = structuredClone(stored) as {
      draft: { alternatives: { formalSequential: unknown } };
    };
    malformedDraft.draft.alternatives.formalSequential = {};
    expect(
      contract.parseLocalCalculatorDraft(JSON.stringify(malformedDraft))
    ).toEqual({ status: "invalid" });

    const oversizedName = structuredClone(stored) as {
      displayNames: { formalSequential: string };
    };
    oversizedName.displayNames.formalSequential = "A".repeat(81);
    expect(
      contract.parseLocalCalculatorDraft(JSON.stringify(oversizedName))
    ).toEqual({ status: "invalid" });
  });

  it("lets explicit v2 and legacy URLs win over a local draft", () => {
    expect(contract.shouldOfferLocalDraft("empty")).toBe(true);
    expect(contract.shouldOfferLocalDraft("v2")).toBe(false);
    expect(contract.shouldOfferLocalDraft("legacy")).toBe(false);
  });
});

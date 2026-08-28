import {
  createScenarioDraft,
  createScenarioDraftFromLegacyMigration,
  type LegacyMigrationResult,
} from "@/lib/model-v2";

import {
  createCalculatorWorkspaceState,
  type CalculatorWorkspaceState,
} from "./editor-state";
import {
  DEFAULT_SCENARIO_V2_ID,
  type CalculatorUrlBootstrap,
} from "./url-bootstrap";

export function createRenderableCalculatorWorkspaceState(
  bootstrap: CalculatorUrlBootstrap
): CalculatorWorkspaceState {
  if (bootstrap.origin === "empty") {
    return createCalculatorWorkspaceState(bootstrap.draft, {
      urlOrigin: "empty",
    });
  }
  if (bootstrap.origin === "v2") {
    return createCalculatorWorkspaceState(
      bootstrap.draft ?? createScenarioDraft(DEFAULT_SCENARIO_V2_ID),
      {
        urlOrigin: "v2",
        urlGate: bootstrap.gate,
      }
    );
  }
  return createCalculatorWorkspaceState(
    bootstrap.draft ?? createScenarioDraft(DEFAULT_SCENARIO_V2_ID),
    {
      urlOrigin: "legacy",
      urlGate: bootstrap.gate ?? undefined,
      migration: bootstrap.adaptation,
    }
  );
}

export function applyLegacyMigrationConfirmation(
  state: CalculatorWorkspaceState,
  result: LegacyMigrationResult,
  confirmed: boolean
): CalculatorWorkspaceState {
  const adaptation = createScenarioDraftFromLegacyMigration(result, confirmed);
  if (adaptation.status === "ready") {
    return {
      ...createCalculatorWorkspaceState(adaptation.draft, {
        urlOrigin: "legacy",
        urlGate: adaptation.gate,
        migration: adaptation,
      }),
      focusTarget: null,
    };
  }
  return {
    ...state,
    urlOrigin: "legacy",
    urlGate: undefined,
    migration: adaptation,
    focusTarget: confirmed ? { kind: "migration-confirmation" } : null,
    issues: [],
    record: null,
  };
}

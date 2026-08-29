import { getLoadedLegacyAdapter } from "@/lib/load-legacy-adapter";
import { createScenarioDraft } from "@/lib/model-v2";
import type {
  LegacyMigrationResult,
  PartialLegacyMigration,
} from "@/lib/model-v2/legacy-adapter";

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
  const adapter = getLoadedLegacyAdapter();
  if (!adapter) {
    throw new Error("Legacy adapter must be loaded before confirmation");
  }
  const adaptation = adapter.createScenarioDraftFromLegacyMigration(
    result,
    confirmed
  );
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

export interface LegacyMigrationControlTransition {
  state: CalculatorWorkspaceState;
  migrationResult: PartialLegacyMigration | null;
}

export function applyLegacyMigrationControlTransition(
  state: CalculatorWorkspaceState,
  result: PartialLegacyMigration,
  confirmed: boolean
): LegacyMigrationControlTransition {
  const nextState = applyLegacyMigrationConfirmation(
    state,
    result,
    confirmed
  );
  return {
    state: nextState,
    migrationResult:
      nextState.migration?.status === "ready" ? null : result,
  };
}

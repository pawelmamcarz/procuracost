import { describe, expect, it } from "vitest";

import { encodeInputsToParams } from "@/components/calculator-url";
import {
  buildDecisionRecordV2,
  createScenarioDraft,
} from "@/lib/model-v2";
import {
  buildCalculationInputFromLegacyMigration,
  buildDecisionRecordFromLegacyMigration,
  createScenarioDraftFromLegacyMigration,
  migrateLegacyCalculatorParams,
} from "@/lib/model-v2/legacy-adapter";
import { SCENARIOS } from "@/lib/scenarios";

describe("explicit model 2.2.2 migration adapter", () => {
  it("preserves exact migration behaviour behind the adapter entrypoint", () => {
    const legacy = SCENARIOS.find(({ id }) => id === "fleet")!;
    const migration = migrateLegacyCalculatorParams(
      encodeInputsToParams(legacy.inputs, legacy.id)
    );
    const adapted = createScenarioDraftFromLegacyMigration(migration);

    expect(migration.status).toBe("exact");
    expect(adapted.status).toBe("ready");
    if (adapted.status !== "ready") throw new Error("Expected exact adapter");

    expect(
      buildCalculationInputFromLegacyMigration(adapted.draft, adapted.gate)
    ).toEqual({
      kind: "materialized_calculation_input",
      registeredScenarioId: adapted.draft.derivedFromScenarioId,
      context: adapted.draft.context,
      alternatives: adapted.draft.alternatives,
      roleHourlyRates: adapted.draft.roleHourlyRates,
      dailyCostOfInaction: adapted.draft.dailyCostOfInaction,
    });
    expect(
      buildDecisionRecordFromLegacyMigration(adapted.draft, adapted.gate)
        .metadata.migration
    ).toMatchObject({
      sourceSchemaVersion: "legacy-v1",
      status: "exact",
      confirmed: true,
      legacyScenarioId: "fleet",
    });
  });

  it("preserves partial confirmation and ambiguous blocking", () => {
    const partial = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const unconfirmed = createScenarioDraftFromLegacyMigration(partial);
    const confirmed = createScenarioDraftFromLegacyMigration(partial, true);
    const ambiguous = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "not-registered" })
    );

    expect(partial.status).toBe("partial");
    expect(unconfirmed.status).toBe("blocked");
    expect(confirmed.status).toBe("ready");
    expect(ambiguous.status).toBe("ambiguous");
    expect(createScenarioDraftFromLegacyMigration(ambiguous).status).toBe(
      "blocked"
    );
  });

  it("does not let the native builder accept a legacy migration gate", () => {
    const migration = migrateLegacyCalculatorParams(
      new URLSearchParams({ sid: "erp" })
    );
    const adapted = createScenarioDraftFromLegacyMigration(migration, true);
    if (adapted.status !== "ready") throw new Error("Expected partial adapter");

    expect(() =>
      (buildDecisionRecordV2 as unknown as (...args: unknown[]) => unknown)(
        adapted.draft,
        adapted.gate
      )
    ).toThrow(/native|v2 url/i);

    expect(() =>
      buildDecisionRecordFromLegacyMigration(
        createScenarioDraft("fleet_tco_reframing"),
        adapted.gate
      )
    ).toThrow(/scenario|migration|canonical/i);
  });
});

import { describe, expect, it } from "vitest";

import {
  baseScenarioShareCopy,
  buildBaseScenarioShareParams,
} from "@/components/calculator-v2/share";
import { calculatorV2T } from "@/lib/i18n";
import {
  V2_URL_KEYS,
  createScenarioDraft,
  encodeV2CalculatorState,
  stateForScenarioV2,
} from "@/lib/model-v2";

describe("calculator v2 base-scenario sharing", () => {
  it("copies exactly the canonical URL state for the derived base scenario", () => {
    const draft = createScenarioDraft("erp_transformation_discovery");

    expect(buildBaseScenarioShareParams(draft).toString()).toBe(
      encodeV2CalculatorState(
        stateForScenarioV2("erp_transformation_discovery")
      ).toString()
    );
  });

  it("does not let local workflow, label, date, or economic edits affect the URL", () => {
    const draft = createScenarioDraft("fleet_tco_reframing");
    const expected = buildBaseScenarioShareParams(draft).toString();
    const editable = draft.alternatives.formalSequential.workflowDesign.steps.find(
      (step) => !step.lockedLegalProvenance
    );
    if (!editable) throw new Error("Expected an editable workflow step");

    editable.userLabel = "Local review step";
    editable.predecessorIds = [];
    editable.activeDays.central += 2;
    draft.context.initiatedOn = "2027-01-12";
    draft.economicAssumptions.contractValue.central += 12345;
    draft.dailyCostOfInaction.central += 50;

    expect(buildBaseScenarioShareParams(draft).toString()).toBe(expected);
  });

  it("emits only the fixed v2 codec keys and no custom-map payload", () => {
    const params = buildBaseScenarioShareParams(
      createScenarioDraft("fleet_tco_reframing")
    );

    expect([...params.keys()]).toEqual(V2_URL_KEYS);
    expect(params.has("map")).toBe(false);
    expect(params.has("draft")).toBe(false);
    expect(params.has("json")).toBe(false);
    expect(params.toString()).not.toContain("userLabel");
  });

  it.each(["pl", "en"] as const)(
    "names base-scenario copying and discloses every local-only category in %s",
    (lang) => {
      const copy = baseScenarioShareCopy(lang);

      expect(copy).toEqual(calculatorV2T[lang].share);
      expect(copy.action).toBe(
        lang === "pl" ? "Kopiuj link do scenariusza bazowego" : "Copy base-scenario link"
      );
      for (const phrase of lang === "pl"
        ? ["map procesu", "własne nazwy kroków", "data wszczęcia", "założenia ekonomiczne"]
        : ["Process-map edits", "custom step labels", "initiated-on date", "economic assumptions"]) {
        expect(copy.disclosure).toContain(phrase);
      }
      expect(copy.action.toLowerCase()).not.toContain(
        lang === "pl" ? "porównania" : "comparison"
      );
    }
  );
});

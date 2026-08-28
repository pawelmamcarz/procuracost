import { describe, expect, it } from "vitest";

import {
  CALCULATOR_RESULT_REGION_ID,
  calculatorFocusTargetElementId,
} from "@/components/calculator-v2/CalculatorWorkspace";

describe("calculator declarative focus contract", () => {
  it("maps each focus-target kind to a stable element ID", () => {
    expect(
      calculatorFocusTargetElementId(
        {
          kind: "step-node",
          alternativeId: "formalSequential",
          stepId: "brief",
        },
        "desktop"
      )
    ).toBe("process-step-formalSequential-brief");
    expect(
      calculatorFocusTargetElementId(
        {
          kind: "step-node",
          alternativeId: "formalSequential",
          stepId: "brief",
        },
        "mobile"
      )
    ).toBe("process-step-formalSequential-brief-mobile");
    expect(
      calculatorFocusTargetElementId({
        kind: "step-label",
        alternativeId: "adaptiveCompliant",
        stepId: "discovery",
      })
    ).toBe("process-step-label-adaptiveCompliant-discovery");
    expect(
      calculatorFocusTargetElementId({
        kind: "lane-add",
        alternativeId: "adaptiveCompliant",
      })
    ).toBe("process-lane-add-adaptiveCompliant");
    expect(
      calculatorFocusTargetElementId({ kind: "migration-confirmation" })
    ).toBe("migration-confirmation");
    expect(
      calculatorFocusTargetElementId({ kind: "decision-record" })
    ).toBe(CALCULATOR_RESULT_REGION_ID);
  });
});

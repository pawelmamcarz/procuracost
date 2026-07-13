import assert from "node:assert/strict";
import { test } from "node:test";

import {
  calculateCosts,
  calculateMatrix,
  DIMENSION_DETAIL_TO_MULTIPLIER,
  getDimensionMultiplierDetails,
  getDimensionMultipliers,
  ProcurementInputs,
} from "../lib/calculations";
import { SCENARIOS } from "../lib/scenarios";

const stakeholders: ProcurementInputs["stakeholders"] = {
  requestor: { count: 1, dailyRate: 900 },
  buyer: { count: 2, dailyRate: 1_000 },
  lawyer: { count: 1, dailyRate: 1_400 },
  finance: { count: 1, dailyRate: 1_100 },
  manager: { count: 1, dailyRate: 1_600 },
  executive: { count: 1, dailyRate: 2_500 },
};

const baseInputs: ProcurementInputs = {
  contractValue: 2_000_000,
  tcoHorizonYears: 3,
  processType: "private_formal",
  techLevel: "partial_erp",
  stakeholders,
  dailyCostOfInaction: 15_000,
  renegotiationCost: 200_000,
  bypassAuditExposure: 300_000,
  spendType: "indirect",
  processPhase: "downstream",
};

function assertBreakdownTotal(result: ReturnType<typeof calculateCosts>["rigid"]) {
  const componentSum =
    result.timeCost +
    result.adminCost +
    result.opportunityCost +
    result.productivityCost +
    result.renegotiationCost +
    result.tcoCost +
    result.bypassCost;
  assert.ok(Math.abs(result.total - componentSum) < 1e-9);
}

test("neutral context leaves every dimension multiplier at one", () => {
  assert.deepEqual(getDimensionMultipliers(), {
    tcoMultiplier: 1,
    delayMultiplier: 1,
    bypassMultiplier: 1,
    renegotiationMultiplier: 1,
    staffIntensityMultiplier: 1,
    coordinationIntensityMultiplier: 1,
  });
});

test("Direct x Upstream applies the documented interaction multipliers", () => {
  const multipliers = getDimensionMultipliers("direct", "upstream");
  assert.equal(multipliers.tcoMultiplier, 1.62);
  assert.equal(multipliers.delayMultiplier, 1.4);
  assert.equal(multipliers.bypassMultiplier, 1.4375);
  assert.ok(Math.abs(multipliers.renegotiationMultiplier - 1.587) < 1e-12);
  assert.equal(multipliers.staffIntensityMultiplier, 1.4375);
  assert.equal(multipliers.coordinationIntensityMultiplier, 1.3);
});

test("every displayed multiplier detail maps to the correct model field", () => {
  const multipliers = getDimensionMultipliers("direct", "upstream");
  const details = getDimensionMultiplierDetails("direct", "upstream");
  for (const detail of details) {
    assert.equal(detail.value, multipliers[DIMENSION_DETAIL_TO_MULTIPLIER[detail.key]]);
  }
});

test("cost calculation is deterministic, finite and internally additive", () => {
  const first = calculateCosts(baseInputs);
  const second = calculateCosts(baseInputs);
  assert.deepEqual(first, second);
  assert.ok(first.rigidDays > first.flexibleDays);
  assert.ok(first.delta > 0);
  assert.ok(Number.isFinite(first.deltaPercent));
  assertBreakdownTotal(first.rigid);
  assertBreakdownTotal(first.flexible);
  assert.equal(
    Object.values(first.trace.staffCostsByRole.rigid).reduce((sum, cost) => sum + cost, 0),
    first.rigid.timeCost,
  );
  assert.equal(first.trace.renegotiation.rigidExpectedCost, first.rigid.renegotiationCost);
  assert.equal(first.trace.bypass.flexibleProbability, first.flexibleBypassProbability);
  assert.ok(first.rigid.tcoCost <= baseInputs.contractValue * 0.3);
  assert.ok(first.flexible.tcoCost <= baseInputs.contractValue * 0.3);
});

test("negative monetary and stakeholder inputs cannot create negative costs", () => {
  const result = calculateCosts({
    ...baseInputs,
    contractValue: -1,
    tcoHorizonYears: -1,
    dailyCostOfInaction: -1,
    renegotiationCost: -1,
    bypassAuditExposure: -1,
    stakeholders: {
      ...stakeholders,
      buyer: { count: -2, dailyRate: -1_000 },
    },
  });
  for (const breakdown of [result.rigid, result.flexible]) {
    for (const value of Object.values(breakdown)) assert.ok(value >= 0);
  }
});

test("matrix exposes the flexible bypass probability actually used by the model", () => {
  const matrix = calculateMatrix(baseInputs);
  assert.equal(matrix.length, 8);
  for (const techLevel of ["manual", "sourcing_tool", "partial_erp", "end_to_end"] as const) {
    const expected = calculateCosts({ ...baseInputs, techLevel });
    const flexibleCell = matrix.find(
      (cell) => cell.techLevel === techLevel && cell.processMode === "flexible",
    );
    assert.equal(flexibleCell?.bypassProbability, expected.flexibleBypassProbability);
  }
});

test("all built-in scenarios produce finite, internally consistent outputs", () => {
  for (const scenario of SCENARIOS) {
    const result = calculateCosts(scenario.inputs);
    assert.ok(Number.isFinite(result.rigid.total), scenario.id);
    assert.ok(Number.isFinite(result.flexible.total), scenario.id);
    assert.ok(Number.isFinite(result.deltaPercent), scenario.id);
    assertBreakdownTotal(result.rigid);
    assertBreakdownTotal(result.flexible);
  }
});

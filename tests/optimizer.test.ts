import assert from "node:assert/strict";
import { test } from "node:test";

import { optimize, ProcurementFeatures } from "../lib/optimizer";

const features: ProcurementFeatures = {
  contractValue: 2_000_000,
  supplierCount: 4,
  complexity: 4,
  urgencyDays: 60,
  isPublicSector: false,
  innovationRequired: true,
  supplyRisk: 3,
  strategicImportance: 5,
  marketMaturity: 2,
  spendType: "direct",
  processPhase: "upstream",
};

test("optimizer is deterministic and all 30 scoring variants cast one vote", () => {
  const first = optimize(features, "en");
  const second = optimize(features, "en");
  assert.deepEqual(first, second);
  assert.equal(first.ranked.reduce((sum, path) => sum + path.votes, 0), 30);
  assert.equal(first.ranked.length, 6);
  assert.ok(first.topPath.confidence >= 0 && first.topPath.confidence <= 1);
});

test("local sensitivity values are bounded and scenario-specific", () => {
  const strategic = optimize(features, "en").featureImportance;
  const reference = optimize(
    {
      ...features,
      contractValue: 1_000_000,
      supplierCount: 5,
      complexity: 3,
      urgencyDays: 90,
      innovationRequired: false,
      supplyRisk: 3,
      strategicImportance: 3,
      marketMaturity: 3,
      spendType: "indirect",
      processPhase: "downstream",
    },
    "en",
  ).featureImportance;
  for (const item of strategic) assert.ok(item.importance >= 0 && item.importance <= 1);
  assert.notDeepEqual(strategic, reference);
});

test("PZP orientation uses the 2026 national threshold", () => {
  const result = optimize(
    { ...features, contractValue: 150_000, isPublicSector: true },
    "en",
  );
  assert.match(result.policyNote, /170,000 PLN/);
  assert.match(result.policyNote, /1 January 2026/);
});

test("PZP orientation distinguishes central and sub-central EU thresholds", () => {
  const result = optimize(
    { ...features, contractValue: 700_000, isPublicSector: true },
    "en",
  );
  assert.match(result.policyNote, /603,400–930,960 PLN/);
  assert.match(result.policyNote, /Verify authority and contract type/);
});

import type { DecisionRecordV2 } from "@/lib/model-v2";

export function pairedComponentDifferences(record: DecisionRecordV2) {
  const formal = record.alternatives.formalSequential.result;
  const adaptive = record.alternatives.adaptiveCompliant.result;

  return ([
    ["role_cost", "roleCost"],
    ["non_labour_cost", "nonLabourCost"],
    ["delay_cost", "delayCost"],
    ["contract_cost", "contractCost"],
  ] as const).map(([id, field]) => ({
    id,
    difference: {
      low: formal[field].low - adaptive[field].low,
      central: formal[field].central - adaptive[field].central,
      high: formal[field].high - adaptive[field].high,
    },
  }));
}

export function centralDelayShare(record: DecisionRecordV2): number | null {
  if (record.comparison.deltaCost === 0) return null;
  const delay = record.drivers.find(({ id }) => id === "delay_cost");
  if (!delay) throw new Error("Decision record requires a delay-cost driver");
  return delay.contribution.central / record.comparison.deltaCost;
}

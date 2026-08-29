import {
  buildDecisionRecordV2,
  createScenarioDraft,
  type DecisionRecordV2,
} from "@/lib/model-v2";

export const B1_EXPORTED_AT = "2026-08-28T14:05:06.000Z";

export function fleetDecisionRecord(): DecisionRecordV2 {
  return buildDecisionRecordV2(createScenarioDraft("fleet_tco_reframing"));
}

export function publicItDecisionRecord(): DecisionRecordV2 {
  return buildDecisionRecordV2(
    createScenarioDraft("public_it_open_with_market_consultation")
  );
}

export function decisionRecordWithSign(
  deltaCost: number,
  low: number,
  high: number
): DecisionRecordV2 {
  const record = structuredClone(fleetDecisionRecord());
  record.comparison.deltaCost = deltaCost;
  record.comparison.deltaCostOuterEnvelope = { low, high };
  return record;
}

export function labelledDecisionRecord(): DecisionRecordV2 {
  const draft = createScenarioDraft("fleet_tco_reframing");
  draft.alternatives.formalSequential.workflowDesign.steps[0].userLabel =
    "Supplier landscape review";
  delete draft.alternatives.adaptiveCompliant.workflowDesign.steps[0]
    .userLabel;
  return buildDecisionRecordV2(draft);
}

export function recordWithSuppliedDriverSentinel(): DecisionRecordV2 {
  const record = structuredClone(fleetDecisionRecord());
  record.drivers[0].contribution = {
    low: -9_876.54,
    central: 1_234.56,
    high: 7_654.32,
  };
  return record;
}

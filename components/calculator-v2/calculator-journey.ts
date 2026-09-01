import {
  CALCULATOR_STAGES,
  type CalculatorStage,
} from "./local-draft";

const STAGE_INDEX = new Map(
  CALCULATOR_STAGES.map((stage, index) => [stage, index] as const)
);

export function calculatorStageFromHash(
  hash: string,
  hasRecord: boolean
): CalculatorStage {
  const candidate = hash.startsWith("#") ? hash.slice(1) : hash;
  const stage = CALCULATOR_STAGES.find((value) => value === candidate);
  if (!stage) return "case";
  return resolveCalculatorStageRequest(stage, hasRecord);
}

export function resolveCalculatorStageRequest(
  stage: CalculatorStage,
  hasRecord: boolean,
): CalculatorStage {
  return stage === "record" && !hasRecord ? "costs" : stage;
}

export interface CalculatorStageLocation {
  stage: CalculatorStage;
  normalizedHash: string;
  shouldReplace: boolean;
}

export function resolveCalculatorStageLocation(
  hash: string,
  hasRecord: boolean,
): CalculatorStageLocation {
  const stage = calculatorStageFromHash(hash, hasRecord);
  if (hash === "") {
    return { stage, normalizedHash: "", shouldReplace: false };
  }
  const normalizedHash = calculatorStageHash(stage);
  return {
    stage,
    normalizedHash,
    shouldReplace: hash !== normalizedHash,
  };
}

export function calculatorStageHash(stage: CalculatorStage): string {
  return `#${stage}`;
}

export function nextCalculatorStage(
  stage: CalculatorStage,
  hasRecord: boolean
): CalculatorStage {
  if (stage === "costs") return hasRecord ? "record" : "costs";
  if (stage === "record") return "record";
  return CALCULATOR_STAGES[(STAGE_INDEX.get(stage) ?? 0) + 1];
}

export function previousCalculatorStage(
  stage: CalculatorStage
): CalculatorStage {
  const index = STAGE_INDEX.get(stage) ?? 0;
  return CALCULATOR_STAGES[Math.max(0, index - 1)];
}

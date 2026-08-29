import type { PractitionerSourceRefId } from "./model-v2/evidence";

export const READINESS_RESPONSE_OPTIONS = [
  "not_met",
  "to_complete",
  "confirmed",
] as const;

export type ReadinessResponseOption =
  (typeof READINESS_RESPONSE_OPTIONS)[number];

export const READINESS_CHECKLIST_PROVENANCE = {
  id: "procuracost-authored-readiness-checklist-v1",
  kind: "authored_operational_checklist",
  basis: "author_defined_operational_hypotheses",
  intendedUse: "self_description_and_internal_discussion_only",
} as const;

export type ReadinessDomainId =
  | "purpose"
  | "ownership"
  | "process"
  | "requirements"
  | "data_automation"
  | "governance"
  | "adoption"
  | "value_rollout";

export type ReadinessQuestionId =
  | "purpose.friction"
  | "purpose.success"
  | "ownership.business_owner"
  | "ownership.sponsorship"
  | "process.current_state"
  | "process.target_state"
  | "requirements.traceability"
  | "requirements.discovery"
  | "data_automation.data"
  | "data_automation.ai"
  | "governance.boundary"
  | "governance.approvals"
  | "adoption.users"
  | "adoption.plan"
  | "value_rollout.business_case"
  | "value_rollout.rollout";

export type ReadinessResponses = Partial<
  Record<ReadinessQuestionId, ReadinessResponseOption>
>;

export interface ReadinessDomainResponseSummary {
  domainId: ReadinessDomainId;
  questionIds: Record<ReadinessResponseOption, ReadinessQuestionId[]>;
}

export interface ReadinessSelfDescription {
  version: "1.1";
  responseCounts: Record<ReadinessResponseOption, number>;
  domains: ReadinessDomainResponseSummary[];
}

export interface ReadinessQuestionDefinition {
  id: ReadinessQuestionId;
  domainId: ReadinessDomainId;
  checklistProvenanceId: typeof READINESS_CHECKLIST_PROVENANCE.id;
}

export interface ReadinessQuestionCopy {
  prompt: string;
  answers: Record<ReadinessResponseOption, string>;
}

export interface ReadinessDomainDefinition {
  id: ReadinessDomainId;
  thematicSourceRefIds: readonly PractitionerSourceRefId[];
  questions: readonly [ReadinessQuestionDefinition, ReadinessQuestionDefinition];
}

function question(
  id: ReadinessQuestionId,
  domainId: ReadinessDomainId,
): ReadinessQuestionDefinition {
  return {
    id,
    domainId,
    checklistProvenanceId: READINESS_CHECKLIST_PROVENANCE.id,
  };
}

export const READINESS_DOMAINS: readonly ReadinessDomainDefinition[] = [
  {
    id: "purpose",
    thematicSourceRefIds: ["friction_mapping"],
    questions: [
      question("purpose.friction", "purpose"),
      question("purpose.success", "purpose"),
    ],
  },
  {
    id: "ownership",
    thematicSourceRefIds: [
      "internal_challenger",
      "internal_ambassador",
      "champion_continuity",
    ],
    questions: [
      question("ownership.business_owner", "ownership"),
      question("ownership.sponsorship", "ownership"),
    ],
  },
  {
    id: "process",
    thematicSourceRefIds: ["operational_purchasing", "legacy_procedure"],
    questions: [
      question("process.current_state", "process"),
      question("process.target_state", "process"),
    ],
  },
  {
    id: "requirements",
    thematicSourceRefIds: [
      "marginal_requirements",
      "requirements_blind_spots",
    ],
    questions: [
      question("requirements.traceability", "requirements"),
      question("requirements.discovery", "requirements"),
    ],
  },
  {
    id: "data_automation",
    thematicSourceRefIds: ["bielik", "data_math_separation"],
    questions: [
      question("data_automation.data", "data_automation"),
      question("data_automation.ai", "data_automation"),
    ],
  },
  {
    id: "governance",
    thematicSourceRefIds: ["legacy_procedure", "policy_boundary"],
    questions: [
      question("governance.boundary", "governance"),
      question("governance.approvals", "governance"),
    ],
  },
  {
    id: "adoption",
    thematicSourceRefIds: ["internal_ambassador", "champion_continuity"],
    questions: [
      question("adoption.users", "adoption"),
      question("adoption.plan", "adoption"),
    ],
  },
  {
    id: "value_rollout",
    thematicSourceRefIds: ["tco", "category_transfer"],
    questions: [
      question("value_rollout.business_case", "value_rollout"),
      question("value_rollout.rollout", "value_rollout"),
    ],
  },
];

function groupQuestionIds(
  questionIds: readonly ReadinessQuestionId[],
  responses: ReadinessResponses,
): Record<ReadinessResponseOption, ReadinessQuestionId[]> {
  return {
    not_met: questionIds.filter((id) => responses[id] === "not_met"),
    to_complete: questionIds.filter((id) => responses[id] === "to_complete"),
    confirmed: questionIds.filter((id) => responses[id] === "confirmed"),
  };
}

export function summariseReadinessResponses(
  responses: ReadinessResponses,
): ReadinessSelfDescription | null {
  const questions = READINESS_DOMAINS.flatMap(({ questions: domainQuestions }) =>
    domainQuestions.map(({ id }) => id),
  );

  if (
    questions.some(
      (questionId) =>
        !READINESS_RESPONSE_OPTIONS.includes(
          responses[questionId] as ReadinessResponseOption,
        ),
    )
  ) {
    return null;
  }

  const groupedQuestions = groupQuestionIds(questions, responses);
  const domains = READINESS_DOMAINS.map(
    ({ id: domainId, questions: domainQuestions }) => ({
      domainId,
      questionIds: groupQuestionIds(
        domainQuestions.map(({ id }) => id),
        responses,
      ),
    }),
  );

  return {
    version: "1.1",
    responseCounts: {
      not_met: groupedQuestions.not_met.length,
      to_complete: groupedQuestions.to_complete.length,
      confirmed: groupedQuestions.confirmed.length,
    },
    domains,
  };
}

import { createScenarioDraft, selectCompetitionDisadvantagedAlternative } from "@/lib/model-v2/scenarios";

export function competitionStressDraft() {
  const draft = createScenarioDraft("stable_private_standard_service");
  draft.economicAssumptions = selectCompetitionDisadvantagedAlternative(
    draft.economicAssumptions,
    "adaptiveCompliant"
  );
  return draft;
}

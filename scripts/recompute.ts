import { buildDecisionRecordV2 } from "../lib/model-v2/decision-record";
import {
  renderDiagnosticsMarkdown,
  runCanonicalDiagnostics,
} from "../lib/model-v2/diagnostics";
import {
  SCENARIO_V2_IDS,
  createScenarioDraft,
} from "../lib/model-v2/scenarios";

const records = SCENARIO_V2_IDS.map((scenarioId) =>
  buildDecisionRecordV2(createScenarioDraft(scenarioId))
);

process.stdout.write(renderDiagnosticsMarkdown(runCanonicalDiagnostics(records)));

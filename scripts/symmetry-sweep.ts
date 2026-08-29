import {
  renderSymmetrySweepMarkdown,
  runCanonicalSymmetrySweep,
} from "../lib/model-v2/diagnostics";
import { SCENARIOS_V2 } from "../lib/model-v2/scenarios";

const report = runCanonicalSymmetrySweep(
  SCENARIOS_V2.map(({ id, calculationInput }) => ({ id, calculationInput }))
);

process.stdout.write(renderSymmetrySweepMarkdown(report));

if (report.failures.length > 0) {
  process.exitCode = 1;
}

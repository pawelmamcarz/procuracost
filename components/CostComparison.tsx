import DecisionRecord, {
  type DecisionRecordProps,
} from "@/components/decision-record/DecisionRecord";
import { CalculatorResultBoundary } from "@/components/calculator-v2/CalculatorWorkspace";

export type CostComparisonProps = DecisionRecordProps;

export default function CostComparison(props: CostComparisonProps) {
  return (
    <CalculatorResultBoundary>
      <DecisionRecord {...props} />
    </CalculatorResultBoundary>
  );
}

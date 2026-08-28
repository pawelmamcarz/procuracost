import CalculatorWorkspace from "@/components/calculator-v2/CalculatorWorkspace";

export default function CalculatorClient() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 sm:py-14">
      <CalculatorWorkspace lang="pl" />
    </div>
  );
}

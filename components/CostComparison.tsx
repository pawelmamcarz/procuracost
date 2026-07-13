"use client";

import { ComparisonResult, ProcurementInputs } from "@/lib/calculations";
import { Scenario } from "@/lib/scenarios";
import { Lang } from "@/lib/i18n";
import HeroSummary from "@/components/cost-comparison/HeroSummary";
import PipeFieldExplainer from "@/components/cost-comparison/PipeFieldExplainer";
import CostTotals from "@/components/cost-comparison/CostTotals";
import StepsTable from "@/components/cost-comparison/StepsTable";
import CostMatrix from "@/components/cost-comparison/CostMatrix";
import DimensionCharts from "@/components/cost-comparison/DimensionCharts";
import SensitivityChart from "@/components/cost-comparison/SensitivityChart";
import DetailTable from "@/components/cost-comparison/DetailTable";
import BenchmarkChart from "@/components/cost-comparison/BenchmarkChart";
import SourcesList from "@/components/cost-comparison/SourcesList";

interface Props {
  result: ComparisonResult;
  scenario: Scenario;
  inputs: ProcurementInputs;
  lang?: Lang;
}

export default function CostComparison({ result, scenario, inputs, lang = "pl" }: Props) {
  return (
    <div className="space-y-8">
      <HeroSummary result={result} scenario={scenario} inputs={inputs} lang={lang} />
      <PipeFieldExplainer lang={lang} />
      <CostTotals result={result} lang={lang} />
      <StepsTable inputs={inputs} rigidDays={result.rigidDays} flexibleDays={result.flexibleDays} lang={lang} />
      <CostMatrix inputs={inputs} lang={lang} />
      <DimensionCharts result={result} lang={lang} />
      <SensitivityChart inputs={inputs} lang={lang} />
      <DetailTable result={result} lang={lang} />
      <BenchmarkChart result={result} lang={lang} />
      <SourcesList result={result} lang={lang} />
    </div>
  );
}

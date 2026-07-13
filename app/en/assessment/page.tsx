import type { Metadata } from "next";
import { assessmentT } from "@/lib/i18n";
import AssessmentQuiz from "@/components/AssessmentQuiz";

export const metadata: Metadata = {
  title: "Procurement Design Profile — ProcuraCost 2.0",
  description:
    "A descriptive profile of process sequencing and adaptability; not a validated maturity test.",
};

export default function AssessmentPageEn() {
  const tx = assessmentT.en;
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-blue-600">
          {tx.badge}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">{tx.title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">{tx.subtitle}</p>
      </div>
      <div className="mt-8">
        <AssessmentQuiz lang="en" />
      </div>
    </div>
  );
}

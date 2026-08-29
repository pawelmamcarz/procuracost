import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import { MODEL_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: `Procurement Design Profile: ProcuraCost ${MODEL_VERSION}`,
  description:
    "A descriptive profile of process sequencing and adaptability; not a validated maturity test.",
};

export default function AssessmentPageEn() {
  return <AssessmentQuiz lang="en" />;
}

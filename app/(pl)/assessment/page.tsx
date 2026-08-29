import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import { MODEL_VERSION } from "@/lib/version";

export const metadata: Metadata = {
  title: `Profil projektowania zakupów: ProcuraCost ${MODEL_VERSION}`,
  description:
    "Opisowy profil sekwencyjności i adaptacyjności procesu; nie jest walidowanym testem dojrzałości.",
};

export default function AssessmentPage() {
  return <AssessmentQuiz lang="pl" />;
}

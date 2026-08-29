import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.pl.processDesignProfile;

export default function AssessmentPage() {
  return <AssessmentQuiz lang="pl" />;
}

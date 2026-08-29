import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.en.processDesignProfile;

export default function AssessmentPageEn() {
  return <AssessmentQuiz lang="en" />;
}

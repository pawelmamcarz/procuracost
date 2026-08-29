import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "assessment",
  ...siteMetadataT.en.processDesignProfile,
});

export default function AssessmentPageEn() {
  return <AssessmentQuiz lang="en" />;
}

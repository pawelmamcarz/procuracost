import type { Metadata } from "next";
import AssessmentQuiz from "@/components/AssessmentQuiz";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "assessment",
  ...siteMetadataT.pl.processDesignProfile,
});

export default function AssessmentPage() {
  return <AssessmentQuiz lang="pl" />;
}

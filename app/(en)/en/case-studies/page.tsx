import type { Metadata } from "next";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "caseStudies",
  ...siteMetadataT.en.mechanismsEvidence,
});

export default function EnCaseStudiesPage() {
  return <MechanismsEvidencePage lang="en" />;
}

import type { Metadata } from "next";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "caseStudies",
  ...siteMetadataT.pl.mechanismsEvidence,
});

export default function CaseStudiesPage() {
  return <MechanismsEvidencePage lang="pl" />;
}

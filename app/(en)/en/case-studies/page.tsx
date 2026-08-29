import type { Metadata } from "next";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.en.mechanismsEvidence;

export default function EnCaseStudiesPage() {
  return <MechanismsEvidencePage lang="en" />;
}

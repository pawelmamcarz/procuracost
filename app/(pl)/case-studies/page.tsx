import type { Metadata } from "next";
import MechanismsEvidencePage from "@/components/MechanismsEvidencePage";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.pl.mechanismsEvidence;

export default function CaseStudiesPage() {
  return <MechanismsEvidencePage lang="pl" />;
}

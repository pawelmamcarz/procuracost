import type { Metadata } from "next";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.en.home;

export default function EnHomePage() {
  return <EvidenceFieldHome lang="en" />;
}

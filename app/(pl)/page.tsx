import type { Metadata } from "next";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import { siteMetadataT } from "@/lib/i18n";

export const metadata: Metadata = siteMetadataT.pl.home;

export default function HomePage() {
  return <EvidenceFieldHome lang="pl" />;
}

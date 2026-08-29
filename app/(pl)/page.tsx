import type { Metadata } from "next";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "home",
  ...siteMetadataT.pl.home,
});

export default function HomePage() {
  return <EvidenceFieldHome lang="pl" />;
}

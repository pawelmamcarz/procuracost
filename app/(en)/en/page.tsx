import type { Metadata } from "next";
import EvidenceFieldHome from "@/components/EvidenceFieldHome";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "home",
  ...siteMetadataT.en.home,
});

export default function EnHomePage() {
  return <EvidenceFieldHome lang="en" />;
}

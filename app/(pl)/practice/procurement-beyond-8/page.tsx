import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { SITE_URL } from "@/app/seo-config";
import ProcurementBeyond8 from "@/components/ProcurementBeyond8";
import { practiceT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";
import {
  procurementBeyond8VideoJsonLd,
  structuredDataScript,
} from "@/lib/practice-structured-data";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "procurementBeyond8",
  ...practiceT.pl.metadata,
});

export default function ProcurementBeyond8Page() {
  const videoJsonLd = procurementBeyond8VideoJsonLd({ lang: "pl", siteUrl: SITE_URL });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataScript(videoJsonLd) }}
      />
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[
          {
            name: practiceT.pl.metadata.title.replace(" | ProcuraCost", ""),
            path: "/practice/procurement-beyond-8",
          },
        ]}
      />
      <ProcurementBeyond8 lang="pl" />
    </>
  );
}

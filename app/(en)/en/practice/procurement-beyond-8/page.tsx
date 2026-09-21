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
  lang: "en",
  routeKey: "procurementBeyond8",
  ...practiceT.en.metadata,
});

export default function EnProcurementBeyond8Page() {
  const videoJsonLd = procurementBeyond8VideoJsonLd({ lang: "en", siteUrl: SITE_URL });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: structuredDataScript(videoJsonLd) }}
      />
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[
          {
            name: practiceT.en.metadata.title.replace(" | ProcuraCost", ""),
            path: "/en/practice/procurement-beyond-8",
          },
        ]}
      />
      <ProcurementBeyond8 lang="en" />
    </>
  );
}

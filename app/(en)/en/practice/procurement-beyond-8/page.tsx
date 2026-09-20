import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProcurementBeyond8 from "@/components/ProcurementBeyond8";
import { practiceT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "procurementBeyond8",
  ...practiceT.en.metadata,
});

export default function EnProcurementBeyond8Page() {
  return (
    <>
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

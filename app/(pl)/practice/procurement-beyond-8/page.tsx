import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ProcurementBeyond8 from "@/components/ProcurementBeyond8";
import { practiceT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "procurementBeyond8",
  ...practiceT.pl.metadata,
});

export default function ProcurementBeyond8Page() {
  return (
    <>
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

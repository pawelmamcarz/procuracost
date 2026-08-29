import type { Metadata } from "next";

import MethodologyOverview from "@/components/MethodologyOverview";
import { methodologyOverviewT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "methodology",
  ...methodologyOverviewT.pl.metadata,
});

export default function MethodologyPage() {
  return <MethodologyOverview lang="pl" />;
}

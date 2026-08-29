import type { Metadata } from "next";

import MethodologyOverview from "@/components/MethodologyOverview";
import { methodologyOverviewT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "methodology",
  ...methodologyOverviewT.en.metadata,
});

export default function EnMethodologyPage() {
  return <MethodologyOverview lang="en" />;
}

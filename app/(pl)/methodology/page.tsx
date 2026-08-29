import type { Metadata } from "next";

import MethodologyOverview from "@/components/MethodologyOverview";
import { methodologyOverviewT } from "@/lib/i18n";

export const metadata: Metadata = methodologyOverviewT.pl.metadata;

export default function MethodologyPage() {
  return <MethodologyOverview lang="pl" />;
}

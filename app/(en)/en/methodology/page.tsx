import type { Metadata } from "next";

import MethodologyOverview from "@/components/MethodologyOverview";
import { methodologyOverviewT } from "@/lib/i18n";

export const metadata: Metadata = methodologyOverviewT.en.metadata;

export default function EnMethodologyPage() {
  return <MethodologyOverview lang="en" />;
}

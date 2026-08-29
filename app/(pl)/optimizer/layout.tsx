import type { Metadata } from "next";
import type { ReactNode } from "react";
import { suitabilityT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "optimizer",
  title: suitabilityT.pl.metadataTitle,
  description: suitabilityT.pl.metadataDescription,
});

export default function SuitabilityLayout({ children }: { children: ReactNode }) {
  return children;
}

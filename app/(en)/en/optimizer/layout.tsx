import type { Metadata } from "next";
import type { ReactNode } from "react";
import { suitabilityT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "optimizer",
  title: suitabilityT.en.metadataTitle,
  description: suitabilityT.en.metadataDescription,
});

export default function EnSuitabilityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

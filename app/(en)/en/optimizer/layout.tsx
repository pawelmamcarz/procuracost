import type { Metadata } from "next";
import type { ReactNode } from "react";
import { suitabilityT } from "@/lib/i18n";

export const metadata: Metadata = {
  title: suitabilityT.en.metadataTitle,
  description: suitabilityT.en.metadataDescription,
};

export default function EnSuitabilityLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { suitabilityT } from "@/lib/i18n";

export const metadata: Metadata = {
  title: suitabilityT.pl.metadataTitle,
  description: suitabilityT.pl.metadataDescription,
};

export default function SuitabilityLayout({ children }: { children: ReactNode }) {
  return children;
}

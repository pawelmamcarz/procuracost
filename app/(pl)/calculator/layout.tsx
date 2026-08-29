import type { Metadata } from "next";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "pl",
  routeKey: "calculator",
  ...siteMetadataT.pl.calculator,
});

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { siteMetadataT } from "@/lib/i18n";
import { localizedPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = localizedPageMetadata({
  lang: "en",
  routeKey: "calculator",
  ...siteMetadataT.en.calculator,
});

export default function EnCalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

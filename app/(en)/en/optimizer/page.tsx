import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import SuitabilityComparison from "@/components/SuitabilityComparison";
import { navigationT } from "@/lib/i18n";

export default function EnSuitabilityPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[{ name: navigationT.en.optimizer, path: "/en/optimizer" }]}
      />
      <SuitabilityComparison lang="en" />
    </>
  );
}

import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import SuitabilityComparison from "@/components/SuitabilityComparison";
import { navigationT } from "@/lib/i18n";

export default function SuitabilityPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[{ name: navigationT.pl.optimizer, path: "/optimizer" }]}
      />
      <SuitabilityComparison />
    </>
  );
}

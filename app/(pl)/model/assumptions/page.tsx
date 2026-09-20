import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ModelAssumptionsPage from "@/components/ModelAssumptionsPage";
import { modelAssumptionsT, navigationT } from "@/lib/i18n";

export default function AssumptionsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[
          { name: navigationT.pl.model, path: "/model" },
          {
            name: modelAssumptionsT.pl.metadata.title.replace(" | ProcuraCost", ""),
            path: "/model/assumptions",
          },
        ]}
      />
      <ModelAssumptionsPage lang="pl" />
    </>
  );
}

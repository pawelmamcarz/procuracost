import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ModelAssumptionsPage from "@/components/ModelAssumptionsPage";
import { modelAssumptionsT, navigationT } from "@/lib/i18n";

export default function AssumptionsPageEn() {
  return (
    <>
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[
          { name: navigationT.en.model, path: "/en/model" },
          {
            name: modelAssumptionsT.en.metadata.title.replace(" | ProcuraCost", ""),
            path: "/en/model/assumptions",
          },
        ]}
      />
      <ModelAssumptionsPage lang="en" />
    </>
  );
}

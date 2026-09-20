import { connection } from "next/server";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CalculatorClient from "@/components/CalculatorClient";
import { navigationT } from "@/lib/i18n";
import { jsonLdScriptContent, softwareApplicationJsonLd } from "@/lib/structured-data";

export default async function CalculatorPage() {
  await connection();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(softwareApplicationJsonLd("pl")) }}
      />
      <BreadcrumbJsonLd
        lang="pl"
        crumbs={[{ name: navigationT.pl.calculator, path: "/calculator" }]}
      />
      <CalculatorClient />
    </>
  );
}

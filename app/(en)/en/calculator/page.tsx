import { connection } from "next/server";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import EnCalculatorClient from "@/components/EnCalculatorClient";
import { navigationT } from "@/lib/i18n";
import { jsonLdScriptContent, softwareApplicationJsonLd } from "@/lib/structured-data";

export default async function EnCalculatorPage() {
  await connection();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(softwareApplicationJsonLd("en")) }}
      />
      <BreadcrumbJsonLd
        lang="en"
        crumbs={[{ name: navigationT.en.calculator, path: "/en/calculator" }]}
      />
      <EnCalculatorClient />
    </>
  );
}

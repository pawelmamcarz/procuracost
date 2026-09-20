import { connection } from "next/server";
import CalculatorClient from "@/components/CalculatorClient";
import { jsonLdScriptContent, softwareApplicationJsonLd } from "@/lib/structured-data";

export default async function CalculatorPage() {
  await connection();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(softwareApplicationJsonLd("pl")) }}
      />
      <CalculatorClient />
    </>
  );
}

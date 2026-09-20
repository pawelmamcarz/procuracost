import { connection } from "next/server";
import EnCalculatorClient from "@/components/EnCalculatorClient";
import { jsonLdScriptContent, softwareApplicationJsonLd } from "@/lib/structured-data";

export default async function EnCalculatorPage() {
  await connection();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScriptContent(softwareApplicationJsonLd("en")) }}
      />
      <EnCalculatorClient />
    </>
  );
}

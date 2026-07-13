import { connection } from "next/server";
import EnCalculatorClient from "@/components/EnCalculatorClient";

export default async function EnCalculatorPage() {
  await connection();
  return <EnCalculatorClient />;
}

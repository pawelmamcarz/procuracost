import { connection } from "next/server";
import CalculatorClient from "@/components/CalculatorClient";

export default async function CalculatorPage() {
  await connection();
  return <CalculatorClient />;
}

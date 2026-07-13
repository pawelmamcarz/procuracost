const title = "ProcuraCost — Procurement Cost Calculator";
const description =
  "Measure the hidden opportunity costs of rigid procurement procedures versus flexible policy-based compliance.";

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/en",
    siteName: "ProcuraCost",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image" as const,
    title,
    description,
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

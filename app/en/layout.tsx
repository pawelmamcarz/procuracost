const title = "ProcuraCost — Procurement Cost Calculator";
const description =
  "Compare formal and adaptive procurement paths with the explicit uncertainty range of model 2.0.";

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

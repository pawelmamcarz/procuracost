import Link from "next/link";

export const metadata = {
  title: "ProcuraCost — Procurement Cost Calculator",
  description:
    "Measure the hidden opportunity costs of rigid procurement procedures versus flexible policy-based compliance.",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b border-gray-100 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/en" className="text-lg font-bold text-blue-700">
            ProcuraCost
          </Link>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/en/calculator" className="hover:text-blue-600">
              Calculator
            </Link>
            <Link href="/en/optimizer" className="font-medium text-blue-600 hover:text-blue-700">
              RF Optimizer
            </Link>
            <Link href="/en/case-studies" className="hover:text-blue-600">
              Case Studies
            </Link>
            <Link href="/methodology" className="hover:text-blue-600">
              Methodology
            </Link>
            <Link
              href="/"
              className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600"
            >
              PL
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}

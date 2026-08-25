import { homeT, type Lang } from "@/lib/i18n";

interface BoundaryFieldProps {
  lang: Lang;
}

export default function BoundaryField({ lang }: BoundaryFieldProps) {
  const tx = homeT[lang].boundary;

  return (
    <section aria-labelledby="boundary-field-title" className="border-b border-gray-200 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
        {tx.eyebrow}
      </p>
      <h2 id="boundary-field-title" className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        {tx.title}
      </h2>

      <figure className="mt-8">
        <div className="grid grid-cols-1 items-stretch gap-3 md:grid-cols-[1fr_auto_1.45fr_auto_1.1fr]">
          <div className="flex min-h-28 flex-col justify-center border-x-4 border-red-600 border-y border-red-200 bg-red-50 px-4 py-5">
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">
              {tx.tunnelLabel}
            </p>
            <p className="mt-2 text-sm text-red-900">{tx.tunnelDescription}</p>
          </div>

          <span className="self-center justify-self-center rotate-90 text-2xl text-gray-300 md:rotate-0" aria-hidden="true">
            →
          </span>

          <div className="flex min-h-28 flex-col justify-center border-y-2 border-amber-400 bg-amber-50 px-4 py-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              {tx.boundaryLabel}
            </p>
            <p className="mt-3 break-words font-mono text-[11px] leading-relaxed text-gray-900 sm:text-xs">
              {tx.notation}
            </p>
          </div>

          <span className="self-center justify-self-center rotate-90 text-2xl text-gray-300 md:rotate-0" aria-hidden="true">
            →
          </span>

          <div className="border border-amber-400 bg-amber-50 p-2">
            <div className="flex min-h-24 flex-col justify-center border border-green-400 bg-green-50 px-4 py-4">
              <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                {tx.fieldLabel}
              </p>
              <p className="mt-2 text-sm text-green-700">{tx.fieldDescription}</p>
            </div>
          </div>
        </div>

        <figcaption className="mt-5 max-w-3xl text-xs leading-relaxed text-gray-500">
          {tx.caption}
        </figcaption>
      </figure>
    </section>
  );
}

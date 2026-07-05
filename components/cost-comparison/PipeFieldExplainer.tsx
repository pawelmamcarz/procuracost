import { comparisonT, Lang, PHI_SET } from "@/lib/i18n";

interface Props {
  lang: Lang;
}

export default function PipeFieldExplainer({ lang }: Props) {
  const tx = comparisonT[lang];

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {tx.pipeFieldTitle}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
            {tx.pipeLabel}
          </p>
          <p className="mt-1 font-mono text-xs text-gray-500">a₁ → a₂ → a₃ → ··· → aₙ</p>
          <p className="mt-2 text-xs leading-relaxed text-red-700">{tx.pipeDesc}</p>
        </div>
        <div className="rounded-xl border border-green-100 bg-green-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
            {tx.fieldLabel}
          </p>
          <p className="mt-1 font-mono text-xs text-gray-500">
            {PHI_SET[lang]}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-green-700">{tx.fieldDesc}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">{tx.pipeFieldSource}</p>
    </div>
  );
}

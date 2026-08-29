import { CircleAlert } from "lucide-react";

import { calculatorV2T, type Lang } from "@/lib/i18n";
import type { PartialLegacyMigration } from "@/lib/model-v2/legacy-adapter";

export interface LegacyMigrationConfirmationProps {
  lang: Lang;
  result: PartialLegacyMigration;
  confirmed: boolean;
  onConfirm: (confirmed: boolean) => void;
}

export function LegacyMigrationConfirmation({
  lang,
  result,
  confirmed,
  onConfirm,
}: LegacyMigrationConfirmationProps) {
  const tx = calculatorV2T[lang].migration;
  return (
    <section
      aria-labelledby="migration-confirmation-heading"
      className="border-l-4 border-amber-400 bg-amber-50 p-4"
    >
      <div className="flex items-start gap-3">
        <CircleAlert
          aria-hidden="true"
          className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
        />
        <div className="space-y-3">
          <div>
            <h3
              className="text-sm font-semibold text-gray-900"
              id="migration-confirmation-heading"
            >
              {tx.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-700">
              {tx.description}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-700">{tx.fields}</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-gray-700">
              {result.fieldsRequiringConfirmation.map((field) => (
                <li key={field}>{tx.fieldLabel(field)}</li>
              ))}
            </ul>
          </div>
          <label className="flex min-h-11 items-start gap-3 rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm text-gray-800">
            <input
              checked={confirmed}
              className="mt-1 h-4 w-4 accent-blue-600"
              id="migration-confirmation"
              onChange={(event) => onConfirm(event.currentTarget.checked)}
              type="checkbox"
            />
            <span>{tx.confirmation}</span>
          </label>
          <p className="text-xs leading-relaxed text-gray-700">
            {tx.recalculation}
          </p>
          <span className="sr-only">{tx.retainedValues}</span>
        </div>
      </div>
    </section>
  );
}

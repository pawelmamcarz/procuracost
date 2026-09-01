import { calculatorV2T, type Lang } from "@/lib/i18n";
import type { AlternativeId } from "@/lib/model-v2";

import type { ComparisonDisplayNames } from "./local-draft";

const ALTERNATIVE_IDS: AlternativeId[] = [
  "formalSequential",
  "adaptiveCompliant",
];

export interface ComparisonNameFieldsProps {
  displayNames: ComparisonDisplayNames;
  lang: Lang;
  onChange: (displayNames: ComparisonDisplayNames) => void;
}

export function ComparisonNameFields({
  displayNames,
  lang,
  onChange,
}: ComparisonNameFieldsProps) {
  const tx = calculatorV2T[lang];

  return (
    <fieldset className="border-y border-gray-200 py-5">
      <legend className="text-lg font-bold text-gray-900">
        {tx.journey.namesTitle}
      </legend>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
        {tx.journey.namesDescription}
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {ALTERNATIVE_IDS.map((alternativeId) => (
          <label
            className={
              alternativeId === "formalSequential"
                ? "border-l-4 border-red-500 pl-4"
                : "border-l-4 border-green-500 pl-4"
            }
            htmlFor={`comparison-name-${alternativeId}`}
            key={alternativeId}
          >
            <span className="block text-xs font-medium text-gray-600">
              {tx.journey.nameLabel}
            </span>
            <input
              className="mt-1 min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              id={`comparison-name-${alternativeId}`}
              maxLength={80}
              onChange={(event) =>
                onChange({
                  ...displayNames,
                  [alternativeId]: event.currentTarget.value,
                })
              }
              value={displayNames[alternativeId]}
            />
            <span className="mt-2 block text-xs text-gray-500">
              {tx.journey.canonicalType}: {tx.alternatives[alternativeId]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

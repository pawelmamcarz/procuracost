"use client";

import { m, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { debateT, PHI_SET, type Lang } from "@/lib/i18n";

export default function TunnelFieldToggle({ lang }: { lang: Lang }) {
  const tx = debateT[lang];
  const [field, setField] = useState(false);
  const reducedMotion = useReducedMotion();
  const titleId = useId();
  const descriptionId = useId();

  return (
    <figure className="mt-5">
      <div className="flex flex-wrap gap-2">
        {[false, true].map((isField) => (
          <button
            aria-pressed={field === isField}
            className={`min-h-11 rounded-lg border px-4 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              field === isField
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
            key={String(isField)}
            onClick={() => setField(isField)}
            type="button"
          >
            {isField ? tx.field : tx.tunnel}
          </button>
        ))}
      </div>
      <p className="mt-5 text-sm font-semibold text-gray-900">
        {field ? tx.adaptive : tx.formal}
      </p>
      <div className="mt-3 border-y border-gray-200 py-3">
        <p className="text-xs font-medium text-gray-600">{tx.boundary}</p>
        <p className="mt-1 break-words font-mono text-xs leading-6 text-gray-700">{PHI_SET[lang]}</p>
      </div>
      <svg
        aria-labelledby={`${titleId} ${descriptionId}`}
        className="mt-4 h-auto w-full"
        role="img"
        viewBox="0 0 600 260"
      >
        <title id={titleId}>{field ? tx.field : tx.tunnel}</title>
        <desc id={descriptionId}>{field ? tx.fieldDescription : tx.tunnelDescription} {tx.caption}</desc>
        <path
          className="fill-gray-50 stroke-gray-500"
          d="M45 20H525L575 70V190L525 240H45L25 220V40Z"
          strokeWidth="2"
          data-boundary="shared"
        />
        <m.g
          initial={false}
          animate={{ opacity: field ? 0 : 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          className="fill-none stroke-red-600"
          strokeWidth="3"
        >
          <path d="M100 95H500M100 165H500" />
          <path d="M180 95V165M260 95V165M340 95V165M420 95V165" strokeDasharray="4 6" />
        </m.g>
        <m.path
          initial={false}
          animate={{ d: field ? "M70 130C180 130 170 55 280 65S430 130 530 130" : "M70 130C180 130 170 130 280 130S430 130 530 130" }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          className={`fill-none ${field ? "stroke-green-600" : "stroke-red-600"}`}
          strokeWidth="4"
        />
        <m.path
          initial={false}
          animate={{ opacity: field ? 1 : 0, pathLength: field ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2 }}
          className="fill-none stroke-green-600"
          d="M70 130C180 130 180 200 280 195S430 130 530 130M70 130H530"
          strokeWidth="3"
        />
        <circle className="fill-gray-900" cx="70" cy="130" r="5" />
        <path className="fill-blue-50 stroke-blue-600" d="M530 112L548 130L530 148L512 130Z" strokeWidth="3" />
      </svg>
      <figcaption className="mt-4 border-l-2 border-blue-700 pl-4 text-xs leading-6 text-gray-600">
        {tx.caption}
      </figcaption>
    </figure>
  );
}

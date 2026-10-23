"use client";

import { useState } from "react";
import BlueprintDiagram from "@/components/debate/BlueprintDiagram";
import { debateT, PHI_SET, type Lang } from "@/lib/i18n";

export default function TunnelFieldToggle({ lang }: { lang: Lang }) {
  const tx = debateT[lang];
  const [selected, setSelected] = useState<"tunnel" | "field" | "both">("both");

  return (
    <figure className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-3">
        <p className="font-mono text-sm uppercase tracking-wide text-gray-600">{tx.diagram.drawing}</p>
        <div className="flex gap-1" role="group" aria-label={tx.diagram.drawing}>
          {(["tunnel", "field", "both"] as const).map((value) => (
            <button
              aria-pressed={selected === value}
              className={`min-h-11 border px-4 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                selected === value ? "border-blue-700 bg-blue-700 text-white" : "border-gray-200 bg-white text-gray-700 hover:border-blue-600"
              }`}
              key={value}
              onClick={() => setSelected(value)}
              type="button"
            >
              {tx[value]}
            </button>
          ))}
        </div>
      </div>
      <BlueprintDiagram labels={tx} phi={PHI_SET[lang]} selected={selected} />
      <figcaption className="grid gap-3 border-t border-gray-200 pt-4 text-sm leading-6 text-gray-700 md:grid-cols-2 md:gap-8">
        <p>{tx.diagram.caption} {tx.caption}</p>
        <div>
          <p className="font-mono text-sm text-blue-700">{PHI_SET[lang]}</p>
          <p className="mt-2 text-gray-600">{tx.diagram.note}</p>
        </div>
      </figcaption>
    </figure>
  );
}

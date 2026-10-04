import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function NumberedProvenanceRule({
  className,
  ...props
}: ComponentProps<"ol">) {
  return (
    <ol
      className={cn("border-l-2 border-blue-700 pl-6", className)}
      {...props}
    />
  );
}

export function NumberedProvenanceItem({
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "border-b border-gray-200 py-4 first:pt-0 last:border-b-0 last:pb-0",
        className
      )}
      {...props}
    />
  );
}

export function NumberedPoint({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-block font-mono text-xs text-blue-700",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="absolute -left-[1.82rem] top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-blue-700 bg-white"
      />
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

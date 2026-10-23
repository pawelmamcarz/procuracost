"use client";

import { m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reducedMotion ? 0 : 0.2, delay: reducedMotion ? 0 : index * 0.04 }}
    >
      {children}
    </m.div>
  );
}

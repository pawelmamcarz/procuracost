"use client";

import { animate, m, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";

export default function NumberTween({
  value,
  formatter,
}: {
  value: number;
  formatter: (value: number) => string;
}) {
  const displayed = useMotionValue(value);
  const formatted = useTransform(displayed, formatter);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      displayed.set(value);
      return;
    }
    const controls = animate(displayed, value, { duration: 0.4 });
    return () => controls.stop();
  }, [displayed, reducedMotion, value]);

  return <m.span className="font-mono tabular-nums">{formatted}</m.span>;
}

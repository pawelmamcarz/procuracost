export function scrollBehaviorFor(reducedMotion: boolean): ScrollBehavior {
  return reducedMotion ? "auto" : "smooth";
}

export function revealResult(element: HTMLElement | null): void {
  if (!element) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.focus({ preventScroll: true });
  element.scrollIntoView({
    behavior: scrollBehaviorFor(reducedMotion),
    block: "start",
  });
}

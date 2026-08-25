import { afterEach, expect, it, vi } from "vitest";
import { revealResult, scrollBehaviorFor } from "@/components/result-reveal";

afterEach(() => {
  vi.unstubAllGlobals();
});

it("disables smooth scrolling for reduced motion", () => {
  expect(scrollBehaviorFor(true)).toBe("auto");
  expect(scrollBehaviorFor(false)).toBe("smooth");
});

it.each([
  { reducedMotion: true, behavior: "auto" },
  { reducedMotion: false, behavior: "smooth" },
] as const)(
  "reads motion preference, focuses without scrolling, and uses $behavior scrolling",
  ({ reducedMotion, behavior }) => {
    const matchMedia = vi.fn(() => ({ matches: reducedMotion }) as MediaQueryList);
    const focus = vi.fn();
    const scrollIntoView = vi.fn();
    const element = { focus, scrollIntoView } as unknown as HTMLElement;
    vi.stubGlobal("window", { matchMedia });

    revealResult(element);

    expect(matchMedia).toHaveBeenCalledOnce();
    expect(matchMedia).toHaveBeenCalledWith("(prefers-reduced-motion: reduce)");
    expect(focus).toHaveBeenCalledOnce();
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(scrollIntoView).toHaveBeenCalledOnce();
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior, block: "start" });
    expect(focus.mock.invocationCallOrder[0]).toBeLessThan(
      scrollIntoView.mock.invocationCallOrder[0]
    );
  }
);

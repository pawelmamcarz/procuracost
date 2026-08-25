import { expect, it } from "vitest";
import { scrollBehaviorFor } from "@/components/result-reveal";

it("disables smooth scrolling for reduced motion", () => {
  expect(scrollBehaviorFor(true)).toBe("auto");
  expect(scrollBehaviorFor(false)).toBe("smooth");
});

import { lstatSync, realpathSync } from "node:fs";
import { dirname } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";

describe("Turbopack linked dependencies", () => {
  it("configures an additional root only for linked dependencies", () => {
    const expected = lstatSync("node_modules").isSymbolicLink()
      ? dirname(realpathSync("node_modules"))
      : undefined;
    expect(nextConfig.experimental?.turbopackAdditionalRoots?.linkedDependencies?.path)
      .toBe(expected);
  });
});

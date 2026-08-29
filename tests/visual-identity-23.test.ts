import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("model 2.3 visual identity", () => {
  it("uses one shared-boundary geometry in both Open Graph images", () => {
    for (const path of [
      "app/(pl)/opengraph-image.tsx",
      "app/(en)/en/opengraph-image.tsx",
    ]) {
      const source = readFileSync(path, "utf8");
      expect(source, path).toContain("OpenGraphBoundaryMark");
      expect(source, path).not.toMatch(/width: 120, height: 6/);
    }

    const mark = readFileSync("components/OpenGraphBoundaryMark.tsx", "utf8");
    expect(mark).toContain('data-boundary="shared"');
    expect(mark).toContain('data-path="formal"');
    expect(mark).toContain('data-path="adaptive"');
    expect(mark).toContain('data-endpoint="decision-record"');
  });

  it("keeps the application icon inside one boundary rather than two colour halves", () => {
    const icon = readFileSync("app/icon.svg", "utf8");
    expect(icon).toContain('data-boundary="shared"');
    expect(icon).toContain('data-path="formal"');
    expect(icon).toContain('data-path="adaptive"');
    expect(icon).toContain('data-endpoint="decision-record"');
    expect(icon).not.toMatch(/Left: pipe|Right: field/);
  });
});

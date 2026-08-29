import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { ogT } from "@/lib/i18n";

describe("model 2.3 visual identity", () => {
  it("uses one shared-boundary geometry in both Open Graph images", () => {
    for (const path of [
      "app/(pl)/opengraph-image.tsx",
      "app/(en)/en/opengraph-image.tsx",
    ]) {
      const source = readFileSync(path, "utf8");
      expect(source, path).toContain("OpenGraphBoundaryMark");
      expect(source, path).toContain("ogT");
      expect(source, path).not.toContain(
        "Dwa zgodne projekty procesu. Jeden jawny rachunek kosztu.",
      );
      expect(source, path).not.toContain(
        "Two compliant process designs. One transparent cost record.",
      );
      expect(source, path).not.toMatch(/width: 120, height: 6/);
    }

    expect(ogT.pl.supportLine).toBe(
      "Dwa zgodne projekty przebiegu procesu. Jeden jawny rachunek kosztu.",
    );
    expect(ogT.en.supportLine).toBe(
      "Two compliant workflow designs. One transparent cost record.",
    );

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

  it("gives the canonical English research segment its own Open Graph image convention", () => {
    const path = "app/(en)/research/opengraph-image.tsx";

    expect(existsSync(path)).toBe(true);
    const source = readFileSync(path, "utf8");
    expect(source).toContain('../en/opengraph-image');
    expect(source).toContain("export { alt, contentType, size }");
    expect(source).toContain("export { default }");
  });

  it("keeps internal provenance within the approved neutral palette", () => {
    const source = readFileSync(
      "components/ModelAssumptionsPage.tsx",
      "utf8"
    );

    expect(source).not.toMatch(/(?:bg|border|text)-cyan-/);
    expect(source).toContain("border-gray-950");
  });
});

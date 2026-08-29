import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const ACTIVE_SURFACES = [
  "components/TeamPage.tsx",
  "components/NavBar.tsx",
  "app/(pl)/shortcasty/page.tsx",
  "app/(en)/en/shortcasty/page.tsx",
  "app/(pl)/shortcasty/[slug]/page.tsx",
] as const;

describe("professional public visual language", () => {
  it("keeps active editorial surfaces free of shadows", () => {
    for (const path of ACTIVE_SURFACES) {
      const source = readFileSync(path, "utf8");
      expect(source, path).not.toMatch(/(?:^|\s)(?:hover:)?shadow(?:-|\b)/);
    }
  });

  it("renders the team as an editorial directory and capability register", () => {
    const source = readFileSync("components/TeamPage.tsx", "utf8");

    expect(source).toContain('data-team-surface="directory"');
    expect(source).toContain('data-team-surface="capability-register"');
    expect(source).not.toContain(
      "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
    );
    expect(source).not.toContain(
      "mb-10 rounded-xl border border-gray-100 bg-gray-50 p-6",
    );
  });

  it("renders both Shortcast indexes as linear editorial registers", () => {
    for (const path of [
      "app/(pl)/shortcasty/page.tsx",
      "app/(en)/en/shortcasty/page.tsx",
    ]) {
      const source = readFileSync(path, "utf8");
      expect(source, path).toContain('data-editorial-index="shortcasts"');
      expect(source, path).not.toContain("rounded-2xl bg-blue-600");
      expect(source, path).not.toMatch(/rounded-xl border border-gray-100/);
    }
  });

  it("renders the Shortcast detail as an editorial record rather than a card stack", () => {
    const source = readFileSync("app/(pl)/shortcasty/[slug]/page.tsx", "utf8");

    expect(source).toContain('data-editorial-detail="shortcast"');
    expect(source).not.toContain("rounded-2xl bg-blue-600");
    expect(source).not.toMatch(/rounded-xl border border-(?:gray|green|blue)/);
  });
});

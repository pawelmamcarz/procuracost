import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { calculateCosts } from "@/lib/calculations";
import { MODEL_V2_METADATA } from "@/lib/model-v2/domain";
import { SCENARIOS } from "@/lib/scenarios";
import {
  LEGACY_MODEL_VERSION,
  MODEL_VERSION,
} from "@/lib/version";

describe("legacy model version seal", () => {
  it.each(["lib/calculations.ts", "lib/scenarios.ts"])(
    "%s binds legacy output identity to the immutable compatibility constant",
    (relativePath) => {
      const source = fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");

      expect(source).toContain(
        'import { LEGACY_MODEL_VERSION } from "./version";'
      );
      expect(source).toMatch(/\bLEGACY_MODEL_VERSION\b/g);
      expect(source).not.toMatch(/\bMODEL_VERSION\b/);
    }
  );

  it("keeps the dormant legacy threshold generator on the immutable legacy identity", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "scripts/decision-map.ts"),
      "utf8"
    );

    expect(source).toContain(
      'import { LEGACY_MODEL_VERSION } from "../lib/version";'
    );
    expect(source).toMatch(/\bLEGACY_MODEL_VERSION\b/g);
    expect(source).not.toMatch(/\bMODEL_VERSION\b/);

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8")
    ) as { scripts: Record<string, string> };
    expect(packageJson.scripts.map).toBeUndefined();
    expect(packageJson.scripts["map:legacy"]).toBe(
      "tsx scripts/decision-map.ts"
    );
    expect(source).toContain("Run: npm run map:legacy.");
  });

  it("labels dormant decision-map copy with the immutable legacy identity", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "lib/i18n.ts"),
      "utf8",
    );

    expect(source).toContain(
      'import { LEGACY_MODEL_VERSION, MODEL_VERSION } from "./version";',
    );
    expect(source).toContain("`Model ${LEGACY_MODEL_VERSION} stosuje szerokie mnożniki");
    expect(source).toContain("`Model ${LEGACY_MODEL_VERSION} applies broad context multipliers");
  });

  it("does not retain the superseded Szucs citation error in dormant source copy", () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), "lib/calculations.ts"),
      "utf8",
    );

    expect(source).toContain("selects contractors with about 28% lower productivity");
    expect(source).not.toContain("lowers average contractor total factor productivity by about 10%");
  });

  it("keeps model 2.2.2 traces independent from the native 2.3 model", () => {
    expect(LEGACY_MODEL_VERSION).toBe("2.2.2");
    expect(MODEL_VERSION).toBe("2.3.0");
    expect(MODEL_V2_METADATA.modelVersion).toBe("2.3.0");
    expect(MODEL_VERSION).toBe(MODEL_V2_METADATA.modelVersion);

    const trace = calculateCosts(SCENARIOS[0].inputs).trace;
    expect(trace.modelVersion).toBe(LEGACY_MODEL_VERSION);
    expect(trace.modelVersion).not.toBe(MODEL_V2_METADATA.modelVersion);
  });

  it("keeps legacy scenario provenance labelled 2.2.2", () => {
    const provenance = SCENARIOS.flatMap((scenario) => [
      scenario.caseStudy?.source,
      scenario.caseStudy?.sourceEn,
    ]).filter(
      (source): source is string =>
        typeof source === "string" && source.includes("ProcuraCost")
    );

    expect(provenance.length).toBeGreaterThan(0);
    expect(provenance.every((source) => source.includes("2.2.2"))).toBe(true);
    expect(provenance.every((source) => !source.includes("2.3.0"))).toBe(true);
  });
});

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { kupiecPoAutomatyzacjiMarkdown } from "@/lib/articles/kupiec-po-automatyzacji.generated";

describe("generated article content", () => {
  it("matches the canonical Markdown and tracked module byte for byte", () => {
    const source = "docs/articles/pl/2026-12-kupiec-po-automatyzacji.md";
    const markdown = readFileSync(resolve(process.cwd(), source), "utf8");
    expect(kupiecPoAutomatyzacjiMarkdown).toBe(markdown);
    const expected = `// Generated from ${source}. Do not edit; run npm run articles.\n\nexport const kupiecPoAutomatyzacjiMarkdown = ${JSON.stringify(markdown)};\n`;
    expect(
      readFileSync(resolve(process.cwd(), "lib/articles/kupiec-po-automatyzacji.generated.ts")),
      "Run npm run articles after editing the canonical Markdown",
    ).toEqual(Buffer.from(expected, "utf8"));
  });

  it("loads the page content without filesystem access", () => {
    const page = readFileSync(resolve(process.cwd(), "app/(pl)/kupiec-po-automatyzacji/page.tsx"), "utf8");
    expect(page).toContain('from "@/lib/articles/kupiec-po-automatyzacji.generated"');
    expect(page).not.toMatch(/readFileSync|fs\/promises|node:fs|process\.cwd\(/);
  });
});

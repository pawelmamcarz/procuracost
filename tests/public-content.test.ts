import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));

const currentPublicFiles = [
  "app/layout.tsx",
  "app/en/layout.tsx",
  "app/model/page.tsx",
  "app/en/model/page.tsx",
  "app/model/assumptions/layout.tsx",
  "app/en/model/assumptions/layout.tsx",
  "app/model/assumptions/page.tsx",
  "app/en/model/assumptions/page.tsx",
  "app/assessment/page.tsx",
  "app/en/assessment/page.tsx",
  "app/research-agenda/page.tsx",
  "app/shortcasty/page.tsx",
  "app/en/shortcasty/page.tsx",
  "app/shortcasty/[slug]/page.tsx",
  "lib/i18n.ts",
  "lib/shortcasty.ts",
  "lib/scenarios.ts",
] as const;

const historicalI18nAllowList = [
  "Wpisanie 0 odtwarza niedyskontowany model 2.1.",
  "Model 2.1 stosuje szerokie mnożniki kontekstu wyłącznie do nakładu pracy i niepracowniczego narzutu koordynacyjnego. Pozostałe mechanizmy mają odrębne profile; 1,00 oznacza brak korekty.",
  "Entering 0 reproduces the undiscounted 2.1 model.",
  "Model 2.1 applies broad context multipliers only to staff effort and non-labor coordination overhead. Other mechanisms use separate profiles; 1.00 means no adjustment.",
] as const;

const staleCurrentVersion = /\b(?:Model 2\.1|modelu 2\.1|ProcuraCost 2\.1)\b/;

async function readPublicFile(path: string) {
  return readFile(new URL(path, `file://${root}/`), "utf8");
}

describe("public editorial integrity", () => {
  it("keeps current public surfaces on the active model version", async () => {
    for (const path of currentPublicFiles) {
      let content = await readPublicFile(path);
      if (path === "lib/i18n.ts") {
        for (const historicalSentence of historicalI18nAllowList) {
          content = content.replace(historicalSentence, "");
        }
      }

      expect(content, path).not.toMatch(staleCurrentVersion);
    }
  });

  it("does not advertise placeholder collection or distribution actions", async () => {
    for (const path of currentPublicFiles) {
      const content = await readPublicFile(path);
      expect(content, path).not.toContain("formspree.io/f/placeholder");
      expect(content, path).not.toMatch(/href:\s*["']#["']/);
    }
  });

  it("keeps current public prose free of em dashes", async () => {
    for (const path of currentPublicFiles) {
      expect(await readPublicFile(path), path).not.toContain("—");
    }
  });
});

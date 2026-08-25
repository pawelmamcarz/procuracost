import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));

function staticHtmlLang(path: string) {
  const source = readFileSync(path, "utf8");
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let language: string | undefined;

  function visit(node: ts.Node) {
    if (ts.isJsxOpeningElement(node) && node.tagName.getText(file) === "html") {
      const attribute = node.attributes.properties.find(
        (property): property is ts.JsxAttribute => ts.isJsxAttribute(property) && property.name.getText(file) === "lang",
      );
      if (attribute?.initializer && ts.isStringLiteral(attribute.initializer)) {
        language = attribute.initializer.text;
      }
    }
    node.forEachChild(visit);
  }

  visit(file);
  return language;
}

describe("static language root ownership", () => {
  it("uses separate static route-group root layouts", () => {
    const plLayout = join(root, "app/(pl)/layout.tsx");
    const enLayout = join(root, "app/(en)/layout.tsx");

    expect(existsSync(join(root, "app/layout.tsx"))).toBe(false);
    expect(existsSync(plLayout)).toBe(true);
    expect(existsSync(enLayout)).toBe(true);
    expect(staticHtmlLang(plLayout)).toBe("pl");
    expect(staticHtmlLang(enLayout)).toBe("en");
  });

  it("assigns pages to the language root without changing public URLs", () => {
    const ownedPages = [
      "app/(pl)/page.tsx",
      "app/(pl)/calculator/page.tsx",
      "app/(pl)/research-agenda/page.tsx",
      "app/(en)/en/page.tsx",
      "app/(en)/en/calculator/page.tsx",
      "app/(en)/en/research/page.tsx",
      "app/(en)/research/page.tsx",
    ];

    for (const path of ownedPages) {
      expect(existsSync(join(root, path)), path).toBe(true);
    }
    expect(existsSync(join(root, "app/page.tsx"))).toBe(false);
    expect(existsSync(join(root, "app/en/page.tsx"))).toBe(false);
    expect(existsSync(join(root, "app/research/page.tsx"))).toBe(false);
  });
});

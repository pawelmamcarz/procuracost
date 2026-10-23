import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path: string) => readFileSync(join(root, path), "utf8");

function sources(directory: string): string[] {
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sources(path) : /\.tsx?$/.test(path) ? [path] : [];
  });
}

describe("motion foundation", () => {
  it("provides strict lightweight motion and user-controlled reduced motion", () => {
    const provider = read("components/motion/MotionProvider.tsx");
    expect(provider).toContain("<LazyMotion features={domAnimation} strict>");
    expect(provider).toContain('<MotionConfig reducedMotion="user">');
    for (const lang of ["pl", "en"]) {
      const layout = read(`app/(${lang})/layout.tsx`);
      expect(layout).toContain("<MotionProvider>");
      expect(layout).toContain("</MotionProvider>");
    }
  });

  it("imports motion only through motion/react and never uses the full motion component", () => {
    for (const path of sources("components")) {
      const source = read(path);
      if (!/from ["']motion(?:\/[^"']*)?["']/.test(source)) continue;
      const imports = [...source.matchAll(/from ["'](motion(?:\/[^"']*)?)["']/g)];
      expect(imports.map((match) => match[1]), path).toEqual(imports.map(() => "motion/react"));
      expect(source, path).not.toMatch(/\bmotion\./);
      if (/<(?:m|motion)\./.test(source)) expect(source, path).toMatch(/<m\./);
    }
  });

  it("keeps reveal and number transitions bounded and reduced-motion aware", () => {
    const reveal = read("components/motion/Reveal.tsx");
    expect(reveal).toContain("opacity: 0, y: 8");
    expect(reveal).toContain("once: true, amount: 0.2");
    expect(reveal).toContain("index * 0.04");
    const tween = read("components/motion/NumberTween.tsx");
    expect(tween).toContain("useReducedMotion");
    expect(tween).toContain("displayed.set(value)");
    expect(tween).toContain("duration: 0.4");
    expect(tween).toContain("controls.stop()");
    expect(tween).toContain("tabular-nums");
  });

  it("transitions the selected inspector using lightweight motion without changing rail focus", () => {
    const inspector = read("components/calculator-v2/ProcessStepInspector.tsx");
    expect(inspector).toMatch(/import\s*\{\s*AnimatePresence,\s*m\s*\}\s*from "motion\/react"/);
    expect(inspector).toContain('<AnimatePresence mode="wait">');
    expect(inspector).toContain("<m.div");
    expect(inspector).toContain("key={`${alternativeId}-${step.id}`}");
    expect(inspector).toContain("initial={{ opacity: 0, x: 8 }}");
    expect(inspector).toContain("animate={{ opacity: 1, x: 0 }}");
    expect(inspector).toContain("exit={{ opacity: 0 }}");
    expect(inspector).toContain("duration: 0.15");
    expect(inspector).not.toMatch(/autoFocus|\.focus\(|whileHover|repeat:|boxShadow/);
  });

  it("excludes distracting motion and surface effects from editorial components", () => {
    for (const path of [...sources("components/debate"), ...sources("components/motion")]) {
      const source = read(path);
      expect(source, path).not.toMatch(/whileHover[\s\S]{0,100}scale|repeat:\s*Infinity|boxShadow|shadow-|gradient|filter\s*:/);
    }
  });
});

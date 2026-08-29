import fs from "node:fs";
import path from "node:path";

import ts from "typescript";
import { describe, expect, it } from "vitest";

import * as NativeModelV2 from "@/lib/model-v2";

const REPO_ROOT = process.cwd();
const CODE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
];
const LEGACY_RUNTIME_MODULES = [
  "lib/calculations.ts",
  "lib/decision-map.ts",
  "lib/scenarios.ts",
  "lib/process-templates.ts",
  "lib/model-v2/legacy-migration.ts",
  "lib/model-v2/legacy-migration-draft.ts",
  "lib/model-v2/legacy-adapter.ts",
] as const;

interface DynamicEdge {
  from: string;
  specifier: string | null;
  resolved: string | null;
}

interface RuntimeGraph {
  visited: Set<string>;
  dynamicEdges: DynamicEdge[];
  computedRequires: string[];
}

function repoPath(filePath: string): string {
  return path.relative(REPO_ROOT, filePath).split(path.sep).join("/");
}

function resolveLocalModule(from: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? path.join(REPO_ROOT, specifier.slice(2))
    : specifier.startsWith(".")
      ? path.resolve(path.dirname(from), specifier)
      : null;
  if (!base) return null;

  const candidates = path.extname(base)
    ? [base]
    : [
        ...CODE_EXTENSIONS.map((extension) => `${base}${extension}`),
        ...CODE_EXTENSIONS.map((extension) =>
          path.join(base, `index${extension}`)
        ),
      ];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

function importDeclarationIsRuntime(node: ts.ImportDeclaration): boolean {
  const clause = node.importClause;
  if (!clause) return true;
  if (clause.isTypeOnly) return false;
  if (clause.name) return true;
  const bindings = clause.namedBindings;
  if (!bindings || ts.isNamespaceImport(bindings)) return true;
  return bindings.elements.some((element) => !element.isTypeOnly);
}

function exportDeclarationIsRuntime(node: ts.ExportDeclaration): boolean {
  if (node.isTypeOnly) return false;
  if (!node.exportClause || !ts.isNamedExports(node.exportClause)) return true;
  return node.exportClause.elements.some((element) => !element.isTypeOnly);
}

function traceRuntimeGraph(roots: string[]): RuntimeGraph {
  const visited = new Set<string>();
  const dynamicEdges: DynamicEdge[] = [];
  const computedRequires: string[] = [];
  const pending = roots.map((root) => path.resolve(REPO_ROOT, root));

  while (pending.length > 0) {
    const current = pending.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const source = fs.readFileSync(current, "utf8");
    const sourceFile = ts.createSourceFile(
      current,
      source,
      ts.ScriptTarget.Latest,
      true,
      current.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    );
    const staticSpecifiers: string[] = [];

    for (const statement of sourceFile.statements) {
      if (
        ts.isImportDeclaration(statement) &&
        ts.isStringLiteral(statement.moduleSpecifier) &&
        importDeclarationIsRuntime(statement)
      ) {
        staticSpecifiers.push(statement.moduleSpecifier.text);
      }
      if (
        ts.isExportDeclaration(statement) &&
        statement.moduleSpecifier &&
        ts.isStringLiteral(statement.moduleSpecifier) &&
        exportDeclarationIsRuntime(statement)
      ) {
        staticSpecifiers.push(statement.moduleSpecifier.text);
      }
    }

    function visit(node: ts.Node): void {
      if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword
      ) {
        const argument = node.arguments[0];
        const specifier =
          argument &&
          (ts.isStringLiteral(argument) ||
            ts.isNoSubstitutionTemplateLiteral(argument))
            ? argument.text
            : null;
        dynamicEdges.push({
          from: current,
          specifier,
          resolved: specifier ? resolveLocalModule(current, specifier) : null,
        });
        return;
      }
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        node.expression.text === "require"
      ) {
        const argument = node.arguments[0];
        if (
          node.arguments.length === 1 &&
          argument &&
          (ts.isStringLiteral(argument) ||
            ts.isNoSubstitutionTemplateLiteral(argument))
        ) {
          staticSpecifiers.push(argument.text);
        } else {
          computedRequires.push(current);
        }
      }
      ts.forEachChild(node, visit);
    }
    ts.forEachChild(sourceFile, visit);

    for (const specifier of staticSpecifiers) {
      const resolved = resolveLocalModule(current, specifier);
      if (resolved && CODE_EXTENSIONS.includes(path.extname(resolved))) {
        pending.push(resolved);
      }
    }
  }

  return { visited, dynamicEdges, computedRequires };
}

function reachedRepoPaths(graph: RuntimeGraph): string[] {
  return [...graph.visited].map(repoPath).sort();
}

function forbiddenDynamicClosures(
  graph: RuntimeGraph,
  allowLegacyAdapter: boolean
): Array<{ from: string; specifier: string; forbidden: string[] }> {
  return graph.dynamicEdges.flatMap((edge) => {
    if (!edge.specifier || !edge.resolved) return [];
    const isAllowlistedAdapter =
      repoPath(edge.from) === "lib/load-legacy-adapter.ts" &&
      edge.specifier === "./model-v2/legacy-adapter" &&
      repoPath(edge.resolved) === "lib/model-v2/legacy-adapter.ts";
    if (allowLegacyAdapter && isAllowlistedAdapter) return [];

    const closure = reachedRepoPaths(
      traceRuntimeGraph([repoPath(edge.resolved)])
    );
    const forbidden = closure.filter((file) =>
      LEGACY_RUNTIME_MODULES.includes(
        file as (typeof LEGACY_RUNTIME_MODULES)[number]
      )
    );
    return forbidden.length > 0
      ? [{ from: repoPath(edge.from), specifier: edge.specifier, forbidden }]
      : [];
  });
}

describe("model 2.3 runtime dependency boundary", () => {
  it("keeps both localized assumptions route closures statically native", () => {
    const graph = traceRuntimeGraph([
      "app/(pl)/layout.tsx",
      "app/(pl)/model/assumptions/page.tsx",
      "app/(pl)/model/assumptions/layout.tsx",
      "app/(en)/layout.tsx",
      "app/(en)/en/model/assumptions/page.tsx",
      "app/(en)/en/model/assumptions/layout.tsx",
    ]);
    const reached = reachedRepoPaths(graph);

    expect(
      reached.filter((file) =>
        LEGACY_RUNTIME_MODULES.includes(
          file as (typeof LEGACY_RUNTIME_MODULES)[number]
        )
      )
    ).toEqual([]);
    expect(graph.dynamicEdges.filter(({ specifier }) => specifier === null)).toEqual(
      []
    );
    expect(graph.computedRequires).toEqual([]);
    expect(forbiddenDynamicClosures(graph, false)).toEqual([]);
  });

  it("keeps both localized calculator route closures statically native", () => {
    const graph = traceRuntimeGraph([
      "app/(pl)/layout.tsx",
      "app/(pl)/calculator/page.tsx",
      "app/(pl)/calculator/layout.tsx",
      "app/(en)/layout.tsx",
      "app/(en)/en/calculator/page.tsx",
      "app/(en)/en/calculator/layout.tsx",
    ]);
    const reached = reachedRepoPaths(graph);

    expect(reached.filter((file) => LEGACY_RUNTIME_MODULES.includes(
      file as (typeof LEGACY_RUNTIME_MODULES)[number]
    ))).toEqual([]);
    expect(graph.dynamicEdges.filter(({ specifier }) => specifier === null)).toEqual(
      []
    );
    expect(graph.computedRequires).toEqual([]);

    const legacyDynamicEdges = graph.dynamicEdges.filter(
      ({ resolved }) =>
        resolved && repoPath(resolved) === "lib/model-v2/legacy-adapter.ts"
    );
    expect(
      legacyDynamicEdges.map(({ from, specifier, resolved }) => ({
        from: repoPath(from),
        specifier,
        resolved: resolved ? repoPath(resolved) : null,
      }))
    ).toEqual([
      {
        from: "lib/load-legacy-adapter.ts",
        specifier: "./model-v2/legacy-adapter",
        resolved: "lib/model-v2/legacy-adapter.ts",
      },
    ]);
    expect(
      graph.dynamicEdges
        .filter(({ resolved }) => resolved !== null)
        .map(({ from, specifier, resolved }) => ({
          from: repoPath(from),
          specifier,
          resolved: repoPath(resolved!),
        }))
    ).toEqual([
      {
        from: "lib/load-legacy-adapter.ts",
        specifier: "./model-v2/legacy-adapter",
        resolved: "lib/model-v2/legacy-adapter.ts",
      },
    ]);
    expect(
      graph.dynamicEdges.filter(
        ({ specifier, resolved }) =>
          (specifier?.includes("legacy") ?? false) &&
          (!resolved || repoPath(resolved) !== "lib/model-v2/legacy-adapter.ts")
      )
    ).toEqual([]);
    expect(forbiddenDynamicClosures(graph, true)).toEqual([]);
  });

  it("keeps the native barrel and builders free of static legacy reachability", () => {
    const graph = traceRuntimeGraph([
      "lib/model-v2/index.ts",
      "lib/model-v2/calculation-input.ts",
      "lib/model-v2/decision-record.ts",
    ]);
    const reached = reachedRepoPaths(graph);

    expect(reached.filter((file) => LEGACY_RUNTIME_MODULES.includes(
      file as (typeof LEGACY_RUNTIME_MODULES)[number]
    ))).toEqual([]);
    expect(NativeModelV2).not.toHaveProperty("migrateLegacyCalculatorParams");
    expect(NativeModelV2).not.toHaveProperty(
      "createScenarioDraftFromLegacyMigration"
    );
    expect(NativeModelV2).not.toHaveProperty(
      "assembleDecisionRecordV2FromDraft"
    );
  });

  it("proves the explicit adapter, and an indirect re-export fixture, reach legacy", () => {
    const adapterGraph = traceRuntimeGraph(["lib/model-v2/legacy-adapter.ts"]);
    const negativeGraph = traceRuntimeGraph([
      "tests/fixtures/native-boundary-indirect-root.ts",
    ]);

    expect(reachedRepoPaths(adapterGraph)).toEqual(
      expect.arrayContaining([
        "lib/calculations.ts",
        "lib/scenarios.ts",
        "lib/process-templates.ts",
        "lib/model-v2/legacy-migration.ts",
        "lib/model-v2/legacy-migration-draft.ts",
      ])
    );
    expect(reachedRepoPaths(negativeGraph)).toContain(
      "lib/process-templates.ts"
    );
  });

  it("detects a neutral-name dynamic wrapper around a forbidden dependency", () => {
    const graph = traceRuntimeGraph([
      "tests/fixtures/native-boundary-dynamic-root.ts",
    ]);

    expect(forbiddenDynamicClosures(graph, false)).toEqual([
      {
        from: "tests/fixtures/native-boundary-dynamic-root.ts",
        specifier: "./native-boundary-dynamic-wrapper",
        forbidden: ["lib/process-templates.ts"],
      },
    ]);
  });

  it("resolves modern TypeScript module extensions and rejects computed require", () => {
    const extensionGraph = traceRuntimeGraph([
      "tests/fixtures/native-boundary-mts-root.ts",
    ]);
    const computedRequireGraph = traceRuntimeGraph([
      "tests/fixtures/native-boundary-computed-require.ts",
    ]);

    expect(reachedRepoPaths(extensionGraph)).toContain(
      "lib/process-templates.ts"
    );
    expect(computedRequireGraph.computedRequires.map(repoPath)).toEqual([
      "tests/fixtures/native-boundary-computed-require.ts",
    ]);
  });
});

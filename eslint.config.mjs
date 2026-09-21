import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".test-dist/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // A git worktree under .worktrees/ is a second checkout with its own suite;
    // linting it doubles every finding and fails on its stale copy.
    ".worktrees/**",
  ]),
]);

export default eslintConfig;

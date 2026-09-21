import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    // A git worktree checked out under .worktrees/ carries its own copy of this
    // suite and its own node_modules. Without this exclude, `npm test` runs that
    // second checkout as well and fails on its mismatched React.
    exclude: [...configDefaults.exclude, "**/.worktrees/**"],
  },
});

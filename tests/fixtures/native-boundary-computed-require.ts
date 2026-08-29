const dependency = "@/lib/process-templates";

export function loadComputedFixture() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require(dependency);
}

import type * as LegacyAdapter from "./model-v2/legacy-adapter";

export type LegacyAdapterModule = typeof LegacyAdapter;

let loadedAdapter: LegacyAdapterModule | null = null;
let pendingAdapter: Promise<LegacyAdapterModule> | null = null;

export async function loadLegacyAdapter(): Promise<LegacyAdapterModule> {
  pendingAdapter ??= import("./model-v2/legacy-adapter");
  loadedAdapter = await pendingAdapter;
  return loadedAdapter;
}

export function getLoadedLegacyAdapter(): LegacyAdapterModule | null {
  return loadedAdapter;
}

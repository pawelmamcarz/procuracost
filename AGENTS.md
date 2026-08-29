<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Everything above is managed by create-next-app; keep additions below the END marker. -->

## Project rules live in CLAUDE.md

This file only carries the Next.js warning. The working instructions for this
repository, including commands, model architecture, PL/EN routing and the
neutrality invariant, are in **`CLAUDE.md`**. The design system is in
**`CLAUDE_DESIGN.md`**. Read both before making changes.

Non-negotiables, in short:

- The native model 2.3 implementation lives in `lib/model-v2/`, not in
  components. After changing the model run the focused test, then
  `npm test && npm run recompute && npm run sweep && npm run replicate && npm run build`.
- Never tune parameters to preserve a preferred Tunnel and Field result.
  `docs/MODEL_PARAMETERS.md` is the active model 2.3 parameter and evidence
  contract. Older modules and `docs/archive/model-1.x/` are historical
  provenance, never active sources.
- Keep mandatory legal waits locked and identical in both alternatives. Keep
  implementation readiness independent of `deltaCost`. Practitioner material
  may inform questions and hypotheses only, never weights or calibration.
- All user-facing strings go through `lib/i18n.ts`. PL and EN are separate route
  trees under `app/(pl)/` and `app/(en)/en/`; route groups do not change their
  public URLs. Check whether both need the edit.

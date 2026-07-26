<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- Everything above is managed by create-next-app; keep additions below the END marker. -->

## Project rules live in CLAUDE.md

This file only carries the Next.js warning. The working instructions for this
repo — commands, model architecture, the PL/EN routing rules, and the
load-bearing neutrality invariant — are in **`CLAUDE.md`**, with the design
system in **`CLAUDE_DESIGN.md`**. Read both before making changes.

Non-negotiables, in short:

- The cost model lives in `lib/`, not in components. After touching it run
  `npm test && npm run recompute && npm run sweep && npm run build`.
- Never tune parameters to preserve the Tunnel–Field result. `docs/MODEL_PARAMETERS.md`
  is the model-2.1 source of truth; `docs/archive/model-1.x/` is history, never a source.
- All user-facing strings go through `lib/i18n.ts`. PL and EN are separate route
  trees under `app/` and `app/en/` — check whether both need the edit.

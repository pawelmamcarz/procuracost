# Native Next container

Build from repository root with `docker build -t app-candidate .`. The two-stage
Dockerfile pins Node24 by immutable digest, uses `npm ci`, builds normal Next,
prunes dev dependencies and starts `next start` directly as USER node on
`0.0.0.0:$PORT` (default8080). No standalone output, migrations, notification
worker, cron or seed bootstrap is run. `.dockerignore` is a closed allowlist;
keep environment files and server credentials outside the build context.

Public `NEXT_PUBLIC_*` build arguments are compiled into browser bundles. Supply
the intended public values at build time. Server credentials are runtime-only.
No values should be copied from local environment files into this source tree.
The image has a writable, empty, ephemeral `.next/cache`; do not mount an old
build/cache over it. Use one replica until cache invalidation across replicas is
explicitly supported. Retain the previous origin for rollback until independent
runtime/content/auth acceptance and provider/DNS cutover are complete.

Container health checks `/robots.txt`; that checks HTTP process health only.
Provider readiness, application data, auth and customer delivery are separate gates.
This source change does not enroll or publish a Railway service. Root must bind
the Dockerfile and start command explicitly in the target provider configuration.

Public build arguments: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_VERSION`. Keep the
canonical site URL `https://www.procuracost.com`; use the same explicit version
override at build and runtime when pinning a release stamp. Cloudflare routing
of the canonical domain remains a separate provider gate. This app needs no DB.

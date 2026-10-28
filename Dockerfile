# Native Next runtime. Build from repository root; no migration or worker startup.
FROM node:24@sha256:a5f4366e834695d5f363b920c104953a535d3a9864d1bdf74566a0ebe01daee5 AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --fund=false
COPY . .
# Public browser configuration only. Server credentials belong at runtime.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_VERSION
ARG RAILWAY_ENVIRONMENT_NAME
ARG RAILWAY_PUBLIC_DOMAIN
RUN npm run build && npm prune --omit=dev --ignore-scripts --no-audit --fund=false \
    && rm -rf .next/cache && mkdir -p .next/cache

FROM node:24@sha256:a5f4366e834695d5f363b920c104953a535d3a9864d1bdf74566a0ebe01daee5 AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080
COPY --from=build --chown=node:node /app/package.json /app/package-lock.json /app/next.config.ts /app/tsconfig.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/app ./app
COPY --from=build --chown=node:node /app/components ./components
COPY --from=build --chown=node:node /app/lib ./lib
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e 'fetch("http://127.0.0.1:"+(process.env.PORT||8080)+"/robots.txt",{signal:AbortSignal.timeout(4000)}).then(r=>process.exit(r.status===200?0:1)).catch(()=>process.exit(1))'
CMD ["sh", "-c", "exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 --port \"${PORT:-8080}\""]

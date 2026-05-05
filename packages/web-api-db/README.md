# Topogram Starter: Web API DB

Package-backed SvelteKit + Hono + Postgres starter for `topogram new`.

This starter includes executable `implementation/` provider code. Review local
template trust before generation.

```bash
topogram new ./web-api-db --template @topogram/starter-web-api-db
```

## Contract

- Catalog id: `web-api-db`
- Surfaces: `web`, `api`, `database`
- Generators: `@topogram/generator-sveltekit-web`, `@topogram/generator-hono-api`, `@topogram/generator-postgres-db`
- Runtime stack: SvelteKit + Hono + Postgres
- Executable implementation: yes
- Purpose: full-stack starter with explicit web-to-API and API-to-database wiring.

## First Run

```bash
topogram new ./web-api-db --template web-api-db
cd ./web-api-db
npm install
npm run doctor
npm run check
npm run generate
```

Review copied `implementation/` code before refreshing trust after local edits.

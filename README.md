# Topogram Starters

Package-backed starter templates for Topogram.

These packages are the shared catalog-backed starter path for Topogram. The
`@attebury/topogram` CLI does not bundle product starter templates; catalog
aliases resolve to these versioned packages.

## Packages

| Package | Catalog ID | Surfaces | Stack | Start Here When |
| --- | --- | --- | --- | --- |
| `@attebury/topogram-starter-hello-web` | `hello-web` | web | Vanilla HTML/CSS/JS | You want the smallest starter and no executable implementation trust step. |
| `@attebury/topogram-starter-hello-api` | `hello-api` | api | Hono | You want to model and generate an API surface only. |
| `@attebury/topogram-starter-hello-db` | `hello-db` | database | SQLite | You want database lifecycle output without web/API code. |
| `@attebury/topogram-starter-web-api` | `web-api` | web, api | React + Express | You want a generated web/API app without a database. |
| `@attebury/topogram-starter-web-api-db` | `web-api-db` | web, api, database | SvelteKit + Hono + Postgres | You want the full-stack starter and accept the heavier runtime setup. |

Use the CLI catalog view to choose a starter:

```bash
topogram new --list-templates
topogram new --list-templates --json
topogram catalog show hello-web
```

The JSON list includes `surfaces`, `generators`, `stack`,
`includesExecutableImplementation`, and `recommendedCommand`; agents should use
those fields instead of scraping this README.

## Starter Contracts

All starter packages are intentionally small. They are not demos; they are
starting points that prove a topology, generator combination, and ownership
mode.

- `hello-web` creates a generated vanilla web app with two pages and one simple
  workflow. It has no API, database, or executable implementation provider.
- `hello-api` creates a generated Hono API surface only. Use it when the first
  artifact you need is an API contract and runtime shell.
- `hello-db` creates SQLite database lifecycle output only. Use it to start
  database modeling without web/API code.
- `web-api` creates a generated React + Express app with explicit web-to-API
  wiring and no database dependency.
- `web-api-db` creates a generated SvelteKit + Hono + Postgres app with
  explicit web-to-API and API-to-database wiring.

Executable starters copy `implementation/` provider code into the generated
project and record local trust. `topogram new` does not execute that code, but
`topogram generate` may load it later; review the copied implementation before
refreshing trust after edits.

## User Flow

```bash
topogram template list
topogram catalog show hello-web
topogram new ./my-app --template hello-web
cd ./my-app
npm install
npm run doctor
npm run check
npm run generate
```

Choose `web-api`, `web-api-db`, `hello-api`, or `hello-db` by swapping the
catalog id in the `catalog show` and `new` commands.

## Verify

```bash
npm run pack:check
```

The smoke test packs each starter, runs `topogram template check`, creates a
disposable project with `topogram new --template <tarball>`, then runs
`npm run doctor`, `npm run source:status`, `npm run check`, and `npm run generate`
in that project.

## Catalog Rollout

After publishing a starter package version, update the catalog from this repo
instead of hand-editing every starter entry:

```bash
npm run catalog:update -- ../topograms/topograms.catalog.json
```

The script reads every local `packages/*/package.json`, verifies the matching
`topogram-template.json` versions, requires all starter packages to share one
version, and updates only matching `@attebury/topogram-starter-*` entries in the
given catalog file. Use `--check` when you only want to verify the catalog is
already aligned:

```bash
npm run catalog:update -- ../topograms/topograms.catalog.json --check
```

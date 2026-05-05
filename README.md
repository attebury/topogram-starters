# Topogram Starters

Package-backed starter templates for Topogram.

These packages are the shared catalog-backed starter path for Topogram. The
`@topogram/cli` CLI does not bundle product starter templates; catalog
aliases resolve to these versioned packages.

## Packages

| Package | Catalog ID | Surfaces | Stack | Start Here When |
| --- | --- | --- | --- | --- |
| `@topogram/starter-hello-web` | `hello-web` | web | Vanilla HTML/CSS/JS via `@topogram/generator-vanilla-web` | You want the smallest starter and no executable implementation trust step. |
| `@topogram/starter-hello-api` | `hello-api` | api | Hono via `@topogram/generator-hono-api` | You want to model and generate an API surface only. |
| `@topogram/starter-hello-db` | `hello-db` | database | SQLite via `@topogram/generator-sqlite-db` | You want database lifecycle output without web/API code. |
| `@topogram/starter-web-api` | `web-api` | web, api | React + Express via package generators | You want a generated web/API app without a database. |
| `@topogram/starter-web-api-db` | `web-api-db` | web, api, database | SvelteKit + Hono + Postgres via package generators | You want the full-stack starter and accept the heavier runtime setup. |

Use the CLI catalog view to choose a starter:

```bash
npm install --save-dev @topogram/cli
npx topogram new --list-templates
npx topogram new --list-templates --json
npx topogram catalog show hello-web
```

The JSON list includes `surfaces`, `generators`, `stack`,
`includesExecutableImplementation`, and `recommendedCommand`; agents should use
those fields instead of scraping this README.

## Starter Contracts

All starter packages are intentionally small. They are not demos; they are
starting points that prove a topology, generator combination, and ownership
mode.

- `hello-web` creates a generated vanilla web app with two pages and one simple
  workflow through the external vanilla-web generator package. It has no API,
  database, or executable implementation provider.
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
npm install --save-dev @topogram/cli
npx topogram doctor
npx topogram template list
npx topogram catalog show hello-web
npx topogram new ./my-app --template hello-web
cd ./my-app
npm install
npm run doctor
npm run check
npm run generate
npm --prefix app run compile
```

Choose `web-api`, `web-api-db`, `hello-api`, or `hello-db` by swapping the
catalog id in the `catalog show` and `new` commands.

## Verify

```bash
npm run pack:check
```

See [`CONSUMER_PROOF.md`](./CONSUMER_PROOF.md) for the verification standard
this repo must keep before publishing starter packages.

The smoke test packs each starter, runs `topogram template check`, creates a
disposable project with `topogram new --template <tarball>`, then runs
`npm run doctor`, `npm run source:status`, `npm run check`, `npm run generate`,
and the generated app compile check in that project.

## Catalog Rollout

After publishing a starter package version, update the catalog from this repo
instead of hand-editing every starter entry:

```bash
npm run catalog:update -- ../topograms/topograms.catalog.json
```

The script reads every local `packages/*/package.json`, verifies the matching
`topogram-template.json` versions, requires all starter packages to share one
version, and updates only matching `@topogram/starter-*` entries in the
given catalog file. Use `--check` when you only want to verify the catalog is
already aligned:

```bash
npm run catalog:update -- ../topograms/topograms.catalog.json --check
```

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

## Verify

```bash
npm run pack:check
```

The smoke test packs each starter, runs `topogram template check`, creates a
disposable project with `topogram new --template <tarball>`, then runs
`npm run doctor`, `npm run source:status`, `npm run check`, and `npm run generate`
in that project.

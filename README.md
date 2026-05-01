# Topogram Starters

Package-backed starter templates for Topogram.

These packages are the shared catalog-backed starter path for Topogram. The
`@attebury/topogram` CLI does not bundle product starter templates; catalog
aliases resolve to these versioned packages.

## Packages

| Package | Catalog ID | Stack |
| --- | --- | --- |
| `@attebury/topogram-starter-hello-web` | `hello-web` | Vanilla HTML/CSS/JS |
| `@attebury/topogram-starter-hello-api` | `hello-api` | Hono |
| `@attebury/topogram-starter-hello-db` | `hello-db` | SQLite |
| `@attebury/topogram-starter-web-api` | `web-api` | React + Express |
| `@attebury/topogram-starter-web-api-db` | `web-api-db` | SvelteKit + Hono + Postgres |

## Verify

```bash
npm run pack:check
```

The smoke test packs each starter, runs `topogram template check`, creates a
disposable project with `topogram new --template <tarball>`, then runs
`npm run doctor`, `npm run source:status`, `npm run check`, and `npm run generate`
in that project.

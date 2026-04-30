# Topogram Starters

Package-backed starter templates for Topogram.

These packages mirror the built-in starters shipped with the `@attebury/topogram`
CLI. Built-ins remain available for offline first use; these packages are the
shared catalog-backed starter path.

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
`npm run doctor`, `npm run check`, and `npm run generate` in that project.

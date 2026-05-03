# Topogram Starter: Hello API

Package-backed Hono API-only starter for `topogram new`.

```bash
topogram new ./hello-api --template @attebury/topogram-starter-hello-api
```

## Contract

- Catalog id: `hello-api`
- Surfaces: `api`
- Generator: `@attebury/topogram-generator-hono-api`
- Runtime stack: Hono
- Executable implementation: no
- Purpose: API-only starter for modeling endpoint contracts without web or database output.

## First Run

```bash
topogram new ./hello-api --template hello-api
cd ./hello-api
npm install
npm run doctor
npm run check
npm run generate
```

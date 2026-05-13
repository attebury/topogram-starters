# Topogram Starter: Hello API

Package-backed Hono API-only starter for `topogram copy`.

```bash
topogram copy @topogram/starter-hello-api ./hello-api
```

## Contract

- Catalog id: `hello-api`
- Surfaces: `api`
- Generator: `@topogram/generator-hono-api`
- Runtime stack: Hono
- Executable implementation: no
- Purpose: API-only starter for modeling endpoint contracts without web or database output.

## First Run

```bash
topogram copy hello-api ./hello-api
cd ./hello-api
npm install
npm run doctor
npm run check
npm run generate
```

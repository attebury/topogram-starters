# Topogram Starter: Web API

Package-backed React + Express starter for `topogram new`.

This starter includes executable `implementation/` provider code. Review local
template trust before generation.

```bash
topogram new ./web-api --template @topogram/starter-web-api
```

## Contract

- Catalog id: `web-api`
- Surfaces: `web`, `api`
- Generators: `@topogram/generator-react-web`, `@topogram/generator-express-api`
- Runtime stack: React + Express
- Executable implementation: yes
- Purpose: generated web/API starter with explicit web-to-API wiring and no database dependency.

## First Run

```bash
topogram new ./web-api --template web-api
cd ./web-api
npm install
npm run doctor
npm run check
npm run generate
```

Review copied `implementation/` code before refreshing trust after local edits.

# Topogram Starter: Hello DB

Package-backed SQLite database lifecycle starter for `topogram new`.

```bash
topogram new ./hello-db --template @topogram/starter-hello-db
```

## Contract

- Catalog id: `hello-db`
- Surfaces: `database`
- Generator: `@topogram/generator-sqlite-db`
- Runtime stack: SQLite
- Executable implementation: no
- Purpose: database lifecycle starter for schema/migration output without web or API code.

## First Run

```bash
topogram new ./hello-db --template hello-db
cd ./hello-db
npm install
npm run doctor
npm run check
npm run generate
```

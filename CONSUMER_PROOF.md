# Consumer Proof

This repo publishes starter template packages. Starter verification must prove
that a new user can create, install, check, generate, and compile each starter
from its packed package.

## Required Gate

```bash
npm run pack:check
```

The check must:

- install the Topogram CLI package pinned in `topogram-cli.version` into a clean
  consumer project;
- pack each starter package under `packages/`;
- run `topogram template check <tarball>`;
- create a disposable starter with `topogram new --template <tarball>`;
- run starter-level setup and discovery commands such as `doctor`,
  `query:list`, `source:status`, and `check`;
- run `npm run generate`;
- run `npm --prefix app run compile` after generation.

## Not Acceptable

- Generate-only starter smoke tests.
- Checking only package metadata, sentinel files, or generated paths.
- Fake template/package installs in consumer-facing verification.
- Stale hard-coded `@topogram/cli@x.y.z` literals instead of
  `topogram-cli.version`.

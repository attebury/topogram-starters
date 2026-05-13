# Topogram Starter: Hello iOS

Package-backed SwiftUI native starter for `topogram copy`.

```bash
topogram copy @topogram/starter-hello-ios ./hello-ios
```

## Contract

- Catalog id: `hello-ios`
- Surfaces: `ios`
- Generator: `@topogram/generator-swiftui-native`
- Runtime stack: SwiftUI / SwiftPM
- Executable implementation: no
- Purpose: smallest generated native starter with two screens and one workflow.

## First Run

```bash
topogram copy hello-ios ./hello-ios
cd ./hello-ios
npm install
npm run doctor
npm run check
npm run generate
npm --prefix app run compile
```

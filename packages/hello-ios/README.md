# Topogram Starter: Hello iOS

Package-backed SwiftUI native starter for `topogram new`.

```bash
topogram new ./hello-ios --template @topogram/starter-hello-ios
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
topogram new ./hello-ios --template hello-ios
cd ./hello-ios
npm install
npm run doctor
npm run check
npm run generate
npm --prefix app run compile
```

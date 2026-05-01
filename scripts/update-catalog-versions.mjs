import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesRoot = path.join(root, "packages");
const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const catalogArg = args.find((arg) => !arg.startsWith("-"));

if (!catalogArg) {
  fail("Usage: node scripts/update-catalog-versions.mjs <topograms.catalog.json> [--check]");
}

const catalogPath = path.resolve(process.cwd(), catalogArg);
if (!fs.existsSync(catalogPath)) {
  fail(`Catalog file not found: ${catalogPath}`);
}

const starterPackages = readStarterPackages();
const versions = new Set([...starterPackages.values()].map((pkg) => pkg.version));
if (versions.size !== 1) {
  fail(`Starter packages must share one version, found ${[...versions].join(", ")}`);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
if (!Array.isArray(catalog.entries)) {
  fail("Catalog must contain an entries array.");
}

const catalogStarterEntries = catalog.entries.filter((entry) => {
  return typeof entry?.package === "string" && entry.package.startsWith("@attebury/topogram-starter-");
});
const catalogStarterPackages = new Set(catalogStarterEntries.map((entry) => entry.package));
for (const packageName of starterPackages.keys()) {
  if (!catalogStarterPackages.has(packageName)) {
    fail(`Catalog is missing starter package entry: ${packageName}`);
  }
}
for (const entry of catalogStarterEntries) {
  if (!starterPackages.has(entry.package)) {
    fail(`Catalog starter entry has no matching local package: ${entry.package}`);
  }
}

const updates = [];
for (const entry of catalogStarterEntries) {
  const pkg = starterPackages.get(entry.package);
  if (entry.defaultVersion !== pkg.version) {
    updates.push({
      id: entry.id,
      package: entry.package,
      from: entry.defaultVersion,
      to: pkg.version
    });
    entry.defaultVersion = pkg.version;
  }
}

if (updates.length === 0) {
  console.log(`Catalog starter versions already match ${versions.values().next().value}.`);
  process.exit(0);
}

if (checkOnly) {
  for (const update of updates) {
    console.error(`${update.id}: ${update.from || "(missing)"} -> ${update.to}`);
  }
  fail(`Catalog starter versions are out of date in ${catalogPath}`);
}

fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Updated ${updates.length} catalog starter version(s) in ${catalogPath}:`);
for (const update of updates) {
  console.log(`- ${update.id}: ${update.from || "(missing)"} -> ${update.to}`);
}

function readStarterPackages() {
  const packageDirs = fs.readdirSync(packagesRoot).filter((name) => {
    return fs.statSync(path.join(packagesRoot, name)).isDirectory();
  }).sort();
  const packages = new Map();
  for (const packageDir of packageDirs) {
    const packagePath = path.join(packagesRoot, packageDir, "package.json");
    const manifestPath = path.join(packagesRoot, packageDir, "topogram-template.json");
    if (!fs.existsSync(packagePath)) {
      fail(`${packageDir} is missing package.json`);
    }
    if (!fs.existsSync(manifestPath)) {
      fail(`${packageDir} is missing topogram-template.json`);
    }
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (typeof pkg.name !== "string" || !pkg.name.startsWith("@attebury/topogram-starter-")) {
      fail(`${packageDir} package name is not an @attebury/topogram-starter-* package.`);
    }
    if (typeof pkg.version !== "string" || !pkg.version) {
      fail(`${pkg.name} package.json must include a version.`);
    }
    if (manifest.id !== pkg.name) {
      fail(`${packageDir} manifest id must match package name.`);
    }
    if (manifest.version !== pkg.version) {
      fail(`${packageDir} manifest version ${manifest.version} must match package version ${pkg.version}.`);
    }
    packages.set(pkg.name, {
      packageDir,
      name: pkg.name,
      version: pkg.version
    });
  }
  return packages;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

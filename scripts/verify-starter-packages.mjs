import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesRoot = path.join(root, "packages");
const workRoot = path.join(root, ".tmp", "starter-packages");
const npmCache = path.join(root, ".tmp", "npm-cache");
const cliPackageSpec = process.env.TOPOGRAM_CLI_PACKAGE_SPEC || defaultCliPackageSpec();
const expectedCliVersion = process.env.EXPECTED_TOPOGRAM_CLI_VERSION || expectedVersionFromPackageSpec(cliPackageSpec);
const starterCliPackageSpec = starterDependencySpecFor(cliPackageSpec);
const packageNames = fs.readdirSync(packagesRoot).filter((name) => {
  return fs.statSync(path.join(packagesRoot, name)).isDirectory();
}).sort();

fs.mkdirSync(workRoot, { recursive: true });
fs.mkdirSync(npmCache, { recursive: true });

const runRoot = fs.mkdtempSync(path.join(workRoot, "run."));
const packRoot = path.join(runRoot, "pack");
const consumerRoot = path.join(runRoot, "consumer");
fs.mkdirSync(packRoot, { recursive: true });
fs.mkdirSync(consumerRoot, { recursive: true });

console.log(`Installing Topogram CLI (${cliPackageSpec}) into a consumer project...`);
run("npm", ["init", "-y"], { cwd: consumerRoot, quiet: true });
run("npm", ["config", "set", "@attebury:registry", "https://npm.pkg.github.com", "--location=project"], { cwd: consumerRoot, quiet: true });
if (process.env.NODE_AUTH_TOKEN) {
  run("npm", ["config", "set", "//npm.pkg.github.com/:_authToken", process.env.NODE_AUTH_TOKEN, "--location=project"], { cwd: consumerRoot, quiet: true });
}
run("npm", ["install", cliPackageSpec], { cwd: consumerRoot, quiet: true });

const topogramBin = path.join(consumerRoot, "node_modules", ".bin", process.platform === "win32" ? "topogram.cmd" : "topogram");
assert.equal(fs.existsSync(topogramBin), true, `Expected topogram binary at ${topogramBin}`);
const version = run(topogramBin, ["version", "--json"], { cwd: consumerRoot, quiet: true });
const versionPayload = JSON.parse(version.stdout);
assert.equal(versionPayload.packageName, "@attebury/topogram");
if (expectedCliVersion) {
  assert.equal(versionPayload.version, expectedCliVersion);
}
assert.equal(typeof versionPayload.executablePath, "string");
assert.equal(typeof versionPayload.nodeVersion, "string");
console.log(`Using Topogram CLI ${versionPayload.version} from ${versionPayload.executablePath}`);

for (const packageDirName of packageNames) {
  const packageRoot = path.join(packagesRoot, packageDirName);
  const manifestPath = path.join(packageRoot, "topogram-template.json");
  const pkgPath = path.join(packageRoot, "package.json");
  assert.equal(fs.existsSync(manifestPath), true, `${packageDirName} is missing topogram-template.json`);
  assert.equal(fs.existsSync(pkgPath), true, `${packageDirName} is missing package.json`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  assert.equal(manifest.id, pkg.name, `${packageDirName} manifest id must match package name`);
  assert.equal(manifest.version, pkg.version, `${packageDirName} manifest version must match package version`);

  console.log(`Packing ${pkg.name}...`);
  const pack = run("npm", ["pack", "--silent", "--pack-destination", packRoot], { cwd: packageRoot });
  const tarballName = pack.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
  const tarballPath = path.join(packRoot, tarballName);
  assert.equal(fs.existsSync(tarballPath), true, `Expected tarball ${tarballPath}`);

  console.log(`Checking ${pkg.name}...`);
  run(topogramBin, ["template", "check", tarballPath], { cwd: consumerRoot, quiet: true });

  const starterRoot = path.join(runRoot, `starter-${packageDirName}`);
  console.log(`Creating starter ${packageDirName}...`);
  run(topogramBin, ["new", starterRoot, "--template", tarballPath], {
    cwd: consumerRoot,
    env: {
      TOPOGRAM_CLI_PACKAGE_SPEC: starterCliPackageSpec
    },
    quiet: true
  });
  run("npm", ["install"], { cwd: starterRoot, quiet: true });
  const starterPkg = JSON.parse(fs.readFileSync(path.join(starterRoot, "package.json"), "utf8"));
  assert.equal(starterPkg.scripts?.doctor, "topogram doctor", `${packageDirName} should expose npm run doctor`);
  assert.equal(starterPkg.scripts?.["query:list"], "topogram query list --json", `${packageDirName} should expose npm run query:list`);
  assert.equal(starterPkg.scripts?.["query:show"], "topogram query show", `${packageDirName} should expose npm run query:show`);
  assert.equal(starterPkg.scripts?.["source:status"], "topogram source status --local", `${packageDirName} should expose local npm run source:status`);
  assert.equal(starterPkg.scripts?.["source:status:remote"], "topogram source status --remote", ` should expose npm run source:status:remote`);
  assert.equal(starterPkg.scripts?.["template:detach"], "topogram template detach", `${packageDirName} should expose npm run template:detach`);
  assert.equal(starterPkg.scripts?.["template:detach:dry-run"], "topogram template detach --dry-run", `${packageDirName} should expose npm run template:detach:dry-run`);
  run("npm", ["run", "doctor"], { cwd: starterRoot, quiet: true });
  run("npm", ["run", "query:list"], { cwd: starterRoot, quiet: true });
  run("npm", ["run", "query:show", "--", "component-behavior"], { cwd: starterRoot, quiet: true });
  run("npm", ["run", "source:status"], { cwd: starterRoot, quiet: true });
  const detachDryRun = run(topogramBin, ["template", "detach", starterRoot, "--dry-run", "--json"], { cwd: starterRoot, quiet: true });
  const detachPayload = JSON.parse(detachDryRun.stdout);
  assert.equal(detachPayload.detached, true, `${packageDirName} detach dry-run should plan detach`);
  assert.equal(detachPayload.dryRun, true, `${packageDirName} detach dry-run should not write`);
  assert.equal(detachPayload.plannedRemovals.some((filePath) => filePath.endsWith(".topogram-template-files.json")), true, `${packageDirName} detach dry-run should remove template baseline`);
  if (manifest.includesExecutableImplementation) {
    assert.equal(detachPayload.implementationTrust.retained, true, `${packageDirName} should retain implementation trust`);
  }
  run("npm", ["run", "check"], { cwd: starterRoot, quiet: true });
  run("npm", ["run", "generate"], { cwd: starterRoot, quiet: true });
}

console.log("");
console.log(`Starter package smoke passed for ${packageNames.length} package(s).`);

function run(command, args, options = {}) {
  const result = childProcess.spawnSync(command, args, {
    cwd: options.cwd || root,
    encoding: "utf8",
    env: {
      ...process.env,
      npm_config_cache: npmCache,
      ...(options.env || {}),
      PATH: process.env.PATH || ""
    }
  });
  if (result.status !== 0) {
    throw new Error([
      `Command failed: ${command} ${args.join(" ")}`,
      result.stdout,
      result.stderr
    ].filter(Boolean).join("\n"));
  }
  if (!options.quiet && result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (!options.quiet && result.stderr) {
    process.stderr.write(result.stderr);
  }
  return result;
}

function starterDependencySpecFor(packageSpec) {
  const prefix = "@attebury/topogram@";
  if (packageSpec.startsWith(prefix)) {
    return packageSpec.slice(prefix.length);
  }
  return packageSpec;
}

function expectedVersionFromPackageSpec(packageSpec) {
  const prefix = "@attebury/topogram@";
  if (!packageSpec.startsWith(prefix)) {
    return null;
  }
  const version = packageSpec.slice(prefix.length);
  return /^\d+\.\d+\.\d+/.test(version) ? version : null;
}

function defaultCliPackageSpec() {
  const versionPath = path.join(root, "topogram-cli.version");
  if (!fs.existsSync(versionPath)) {
    return "@attebury/topogram@latest";
  }
  const version = fs.readFileSync(versionPath, "utf8").trim();
  return version ? `@attebury/topogram@${version}` : "@attebury/topogram@latest";
}

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const repoRoot = path.resolve(root, "..", "..");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

const checks = [];

function check(label, passed, details = "") {
  checks.push({ label, passed, details });
}

const app = readJson("app.json").expo;
const eas = readJson("eas.json");

check("App name is set", app.name === "Przepiśnik. Inteligentny organizer kulinarny", app.name);
check("Android package is stable", app.android?.package === "com.lowstylelife.przepisnik", app.android?.package);
check("Android versionCode is numeric", Number.isInteger(app.android?.versionCode), String(app.android?.versionCode));
check("Android builds as app bundle in production", eas.build?.production?.android?.buildType === "app-bundle");
check("Preview build profile exists", Boolean(eas.build?.preview?.android?.buildType));
check("Production mobile env template exists", exists(".env.production.example"));
check("Clerk production checklist exists", exists("CLERK_PRODUCTION_SETUP.md"));
check(
  "Backend deployment docs exist",
  fs.existsSync(path.join(repoRoot, "artifacts", "api-server", "DEPLOYMENT.md")),
);

const failed = checks.filter((item) => !item.passed);

for (const item of checks) {
  const marker = item.passed ? "OK" : "FAIL";
  const details = item.details ? ` (${item.details})` : "";
  console.log(`${marker} ${item.label}${details}`);
}

if (failed.length) {
  console.error(`\nRelease readiness check failed: ${failed.length} issue(s).`);
  process.exit(1);
}

console.log("\nRelease readiness check passed.");

const { spawn } = require("node:child_process");

const env = { ...process.env };

if (!env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY && env.CLERK_PUBLISHABLE_KEY) {
  env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;
}

if (env.REPLIT_EXPO_DEV_DOMAIN) {
  env.EXPO_PACKAGER_PROXY_URL = `https://${env.REPLIT_EXPO_DEV_DOMAIN}`;
}

if (env.REPLIT_DEV_DOMAIN) {
  env.EXPO_PUBLIC_DOMAIN = env.REPLIT_DEV_DOMAIN;
  env.REACT_NATIVE_PACKAGER_HOSTNAME = env.REPLIT_DEV_DOMAIN;
}

if (env.REPL_ID) {
  env.EXPO_PUBLIC_REPL_ID = env.REPL_ID;
}

const pnpmArgs = ["exec", "expo", "start"];

if (env.REPLIT_EXPO_DEV_DOMAIN || env.REPLIT_DEV_DOMAIN) {
  pnpmArgs.push("--localhost");
}

if (env.PORT) {
  pnpmArgs.push("--port", env.PORT);
}

const pnpmCli = env.npm_execpath;
const command = pnpmCli ? process.execPath : process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const args = pnpmCli ? [pnpmCli, ...pnpmArgs] : pnpmArgs;

const child = spawn(command, args, {
  env,
  stdio: "inherit",
  shell: !pnpmCli && process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

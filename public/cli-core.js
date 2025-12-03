// cli-core.js

// =============================================================
// 1. Command-Line String → Flags Collection (Node env. "parseArgs" equivalency)
// =============================================================
export function parseCmds(cmd) {
  if (!cmd) return {};
  const argv = cmd.trim().split(/\s+/);
  const flags = {};
  let i = 0;
  // 如果用户输入 "bandori-parking ..." → 跳过第一个 token
  if (!argv[0].startsWith("-")) i = 1;
  for (; i < argv.length; i++) {
    const token = argv[i];
    if (token.startsWith("--") || token.startsWith("-")) {
      const key = token.startsWith("--") ? token.slice(2) : token.slice(1);
      const next = argv[i+1];
      const val = next && !next.startsWith("-") ? argv[++i] : true;
      if (flags[key] !== undefined)
        throw new Error(`Flag "${key}" 出现多次!`);
      flags[key] = val;
      continue;
    }
  }
  return flags;
}


// =============================================================
// 2. Flags Collection → Command-Line String (inverse of "parseCmds")
// =============================================================
export function parseFlags(flags) {
  let s = ["bandori-parking"];
  for (const k in flags) {
    if (flags[k] !== undefined) {
      s.push(`--${k}`);
      if (flags[k] !== true) s.push(flags[k]);
    }
  }
  return s.join(" ");
}

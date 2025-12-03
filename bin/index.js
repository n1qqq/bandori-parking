#!/usr/bin/env node
// index.js - Simple CLI
import Bandori from '../src/bandori.js';
import { resolveAliases, validateFlags } from '../src/validate-flags.js';
import { HELP_TEXT } from '../src/help.js';

// =============================================================
// 1. Parse Arguments (Browser env. "parseCmds" equivalency)
// =============================================================
function parseArgs() {
  const y = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i+1] && !argv[i+1].startsWith('--') ? argv[++i] : true;
      if (!!y[k]) throw new Error(`Flag "${k}" 出现多次!`);
      y[k] = v;
    } else if (a.startsWith('-')) {
      const k = a.slice(1);
      const v = argv[i+1] && !argv[i+1].startsWith('-') ? argv[++i] : true;
      if (!!y[k]) throw new Error(`Flag "${k}" 出现多次!`);
      y[k] = v;
    }
  }
  return y;
}


// =============================================================
// 2. Parse and Validate
// =============================================================
const args = resolveAliases(parseArgs());
validateFlags(args);


// =============================================================
// 3. Display Helper Document
// =============================================================
if (args.help) {
  console.log(HELP_TEXT);
  process.exit(0);
}


// =============================================================
// 4. Park the Score, if Applicable
// =============================================================
const mode = Number(args.mode || 0);
const bandori = new Bandori(mode);

if (args.boost) {
  const mul = Number(args.boost) / 100;
  const fir = Number(args.fire || 0);
  bandori.boost(mul, fir);
} else if (args.fire) {
  bandori.boost(0, Number(args.fire));
}

if (args.medley) {
  // 传法1: --medley 1,0,2
  // 传法2: --medley "1, , 2"
  const parts = String(args.medley).split(',').map(s => Number(s));
  bandori.medleyBoost(parts[0]||0, parts[1]||0, parts[2]||0, Math.min(parts.length, 3));
}

if (args.calculate) {
  const pts = Number(args.calculate);
  args.num ? bandori.calculate(pts, Number(args.num)) : bandori.calculate(pts);
}

if (args.dual) {
  const pts = Number(args.dual);
  const v = Number(args.va || 0);
  const atmpt = Number(args.atmpt || 0);
  if (args.num) {
    // signature (pts, num, var, atmpt)
    bandori.dualSemiAuto(pts, Number(args.num), v, atmpt);
  } else {
    bandori.dualSemiAuto(pts, v, atmpt);
  }
}

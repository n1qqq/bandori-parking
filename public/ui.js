// ui.js
import { parseCmds, parseFlags } from "./cli-core.js";
import { resolveAliases, validateFlags } from "./validate-flags.js";
import Bandori from "./bandori.js";
import LangManager from "./lang/lang.js";

// =============================================================
// DOM Elements
// =============================================================
const cliInput = document.getElementById("cliInput");
const cliHighlight = document.getElementById("cliHighlight");
const output = document.getElementById("output");
const execBtn = document.getElementById("execBtn");
const themeBtn = document.getElementById("themeBtn");
const langBtn = document.getElementById("langBtn");

const fields = {
  mode: document.getElementById("mode"),
  boost: document.getElementById("boost"),
  fire: document.getElementById("fire"),
  num: document.getElementById("num"),
  medley: document.getElementById("medley"),
  calculate: document.getElementById("calculate"),
};
const buttons = {
  team: {
    btn: document.getElementById("team"), offArray: ["l", "L", "lose", "Lose"]
  },
};


// =============================================================
// Language Package
// =============================================================
const INFOS = {
  HELP_CLI: "",
};

const L = new LangManager();
await L.load("en");

const LANG_MAP = {
  page_title: "title",
  label_cli: "lb_cli",
  label_mode: "lb_mode",
  label_boost: "lb_boost",
  label_fire: "lb_fire",
  label_num: "lb_num",
  label_medley: "lb_medley",
  label_team: "lb_team",
  label_calculate: "lb_calculate",
  execBtn: "run",
  label_output: "lb_output",

  cliInput: "ph_cli",
  boost: "ph_boost",
  num: "ph_num",
  medley: "ph_medley",
  calculate: "ph_calculate",
  
  HELP_CLI: "helpText",
};

function applyLanguage() {
  for (const id in LANG_MAP) {
    const el = document.getElementById(id);
    if (!el) {
      INFOS[id] = L.t(LANG_MAP[id]);
      continue;
    }
    const key = LANG_MAP[id];
    if (key.startsWith("ph_")) {
      el.placeholder = L.t(key);
    } else {
      el.textContent = L.t(key);
    }
  }
}
applyLanguage();

langBtn.addEventListener("click", async () => {
  const next = L.l() === "en" ? "zh" :
               L.l() === "zh" ? "jp" : "en";
  await L.load(next);
  applyLanguage();
  langBtn.textContent = next === "en" ? "EN / 中文 / 日本語" :
                        next === "zh" ? "中文 / 日本語 / EN" : "日本語 / EN / 中文";
});


// =============================================================
// Theme Toggle
// =============================================================
let dark = false;
themeBtn.addEventListener("click", () => {
  dark = !dark;
  document.documentElement.classList.toggle("dark", dark);
});


// =============================================================
// CLI Highlight
// =============================================================
function escapeHTML(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function _highlightCLI(str) {
  return str
    .replace(/(.*)/g, `<span class="text-cli-other">$1</span>`)
    .replace(/(\s-[\w-?]+)/g, `<span class="text-cli-flag">$1</span>`)
    .replace(/(\s[\d,]+)/g, `<span class="text-cli-value">$1</span>`)
    .replace(/(-\d+)/g, `<span class="text-cli-error">$1</span>`);
}

function updateCLIHighlight() {
  const raw = cliInput.value;
  const safe = escapeHTML(raw);
  cliHighlight.innerHTML = _highlightCLI(safe);
}


// =============================================================
// CLI → Form
// =============================================================
cliInput.addEventListener("input", () => {
  try {
    const raw = parseCmds(cliInput.value);
    const flags = resolveAliases(raw);
    for (const k in fields) {
      fields[k].value = flags[k] ?? "";
    }
    for (const k in buttons) {
      buttons[k].btn.checked = !!flags[k] && !buttons[k].offArray.includes(flags[k]);
    }
  } catch (err) {
    output.textContent = err.message;
  }

  updateCLIHighlight();
});


// =============================================================
// Form → CLI
// =============================================================
for (const k in {...fields, ...buttons}) {
  (fields[k] ?? buttons[k].btn).addEventListener("input", () => {
    const flags = {};
    for (const key in buttons) {
      if (buttons[key].btn.checked) flags[key] = true;
    }
    for (const key in fields) {
      const val = fields[key].value.trim();
      if (val !== "") flags[key] = val;
    }
    cliInput.value = parseFlags(flags);

    updateCLIHighlight();
  });
}


// =============================================================
// Calculate
// =============================================================
cliInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    execBtn.click();
  }
});

execBtn.addEventListener("click", () => {
  try {
    const raw = parseCmds(cliInput.value);
    const flags = resolveAliases(raw);
    validateFlags(flags);

    if (flags.help) {
      output.textContent = INFOS.HELP_CLI;
      return;
    }

    const bandori = new Bandori(Number(flags.mode));

    if (flags.boost) {
      const mul = Number(flags.boost) / 100;
      const fir = Number(flags.fire || 0);
      bandori.boost(mul, fir);
    } else if (flags.fire) {
      bandori.boost(0, Number(flags.fire));
    }

    if (flags.medley) {
      const parts = flags.medley.split(",").map(Number);
      bandori.medleyBoost(parts[0]||0, parts[1]||0, parts[2]||0, Math.min(parts.length, 3));
    }

    let result;
    if (flags.calculate) {
      const pts = Number(flags.calculate);
      result = flags.num
        ? bandori.calculate(pts, Number(flags.num))
        : bandori.calculate(pts);
    }

    output.textContent = result;
  } catch (err) {
    output.textContent = "错误: " + err.message;
  }
});

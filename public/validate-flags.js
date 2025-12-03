// validate-flags.js
// =============================================================
// 1. Flag Aliases
// =============================================================
export const FLAG_ALIASES = {
  help: ['h', '?'],
  mode: ['m'],
  boost: ['b'],
  fire: ['f'],
  calculate: ['c', 'calc', 'parking', 'park', 'p'],
  num: ['n'],
  medley: ['mdl'],
  team: ['t', '55', '5v5', 'wl'],
  dual: [],
  va: [],
  atmpt: [],
};


// =============================================================
// 2. Mode Rules
// =============================================================
export const MODE_RULES = {
  14: {
    required: [],
    validate: (flags) => {
      const hasNum = flags.num !== undefined;
      const hasMedley = flags.medley !== undefined;
      if (!hasNum && !hasMedley) {
        throw new Error(`mode=14 需要至少设置 --num 或 --medley 其一`);
      }
      if (hasNum) {
        const n = Number(flags.num);
        const allowed = [30, 65, 100, 1, 2, 3];
        if (!allowed.includes(n)) {
          throw new Error(`mode=14 时, --num 必须为演奏数量底分 30, 65, 100 或演奏数量 1, 2, 3`);
        }
        flags.num = allowed[allowed.indexOf(n) % 3];
      }
      if (hasMedley && !/^\d+(,\d+)*,?$/.test(flags.medley.replace(/\s+/g, ''))) {
        throw new Error(`--medley 必须为逗号分隔数字列表`);
      }
    }
  },

  6: {
    required: ['num'],
    validate: (flags) => {
      if (!/^\d{5,6}$/.test(flags.num)) {
        throw new Error(`mode=6 时，--num 必须为 5~6 位整数(副队综合力)`);
      }
    }
  },

  12: {
    required: ['num'],
    validate: (flags) => {
      if (!/^\d{5,6}$/.test(flags.num)) {
        throw new Error(`mode=12 时，--num 必须为 5~6 位整数(副队综合力)`);
      }
    }
  },

  4: {
    required: ['num'],
    validate: (flags) => {
      const n = Number(flags.num);
      const allowed = [60, 52, 44, 37, 30, 1, 2, 3, 4, 5];
      if (!allowed.includes(n)) {
        throw new Error(`mode=4 时, --num 必须为排名得分 60, 52, 44, 37, 30 或排名 1, 2, 3, 4, 5`);
      }
      flags.num = allowed[allowed.indexOf(n) % 5];
    }
  },

  7: {
    required: ['num'],
    validate: (flags) => {
      const n = Number(flags.num);
      const hasTeam = flags.team !== undefined;
      const allowed = [50, 47, 44, 42, 40, 1, 2, 3, 4, 5];
      if (!allowed.includes(n)) {
        throw new Error(`mode=7 时, --num 必须为排名得分 50, 47, 44, 42, 40 或排名 1, 2, 3, 4, 5`);
      }
      flags.num = allowed[allowed.indexOf(n) % 5];
      if (hasTeam) {
        const status = ['w', 'W', 'win', 'Win', 'l', 'L', 'lose', 'Lose'];
        if (!status.includes(flags.team)) {
          throw new Error(`如若使用 --team flag, 则 team 必须为胜利 w, W, win, Win 或落败 l, L, lose, Lose 或留空`)
        }
        flags.num = flags.num + (status.indexOf(flags.team) < 4 ? 50 : 0);
      }
    }
  },

  10: {
    required: ['num'],
    validate: (flags) => {
      const n = Number(flags.num);
      const allowed = [200, 173, 146, 123, 100, 1, 2, 3, 4, 5];
      if (!allowed.includes(n)) {
        throw new Error(`mode=10 时, --num 必须为排名得分 200, 173, 146, 123, 100 或排名 1, 2, 3, 4, 5`);
      }
      flags.num = allowed[allowed.indexOf(n) % 5];
    }
  },

  13: {
    required: ['num'],
    validate: (flags) => {
      const n = Number(flags.num);
      const hasTeam = flags.team !== undefined;
      const allowed = [125, 117, 110, 105, 100, 1, 2, 3, 4, 5];
      if (!allowed.includes(n)) {
        throw new Error(`mode=13 时, --num 必须为排名得分 125, 117, 110, 105, 100 或排名 1, 2, 3, 4, 5`);
      }
      flags.num = allowed[allowed.indexOf(n) % 5];
      if (hasTeam) {
        const status = ['w', 'W', 'win', 'Win', true, 'l', 'L', 'lose', 'Lose'];
        if (!status.includes(flags.team)) {
          throw new Error(`如若使用 --team flag, 则 team 必须为胜利 w, W, win, Win 或落败 l, L, lose, Lose`)
        }
        flags.num = flags.num + (status.indexOf(flags.team) < 5 ? 125 : 0);
      }
    }
  },
};


// =============================================================
// 3. alias → canonical
// =============================================================
export function resolveAliases(raw) {
  const flags = {};
  for (const canonical in FLAG_ALIASES) {
    const aliases = [canonical, ...FLAG_ALIASES[canonical]];
    for (const a of aliases) {
      if (raw[a] !== undefined) {
        if (flags[canonical] !== undefined) {
          throw new Error(`Flag "${canonical}" 及其别名出现多次!`);
        }
        flags[canonical] = raw[a];
      }
    }
  }
  return flags;
}


// =============================================================
// 4. Validate Flags
// =============================================================
export function validateFlags(flags) {
  if (!!flags.help) return;
  if (!flags.mode) {
    throw new Error(`必须指定 --mode 或其别名 --m; 键入 --? 以查看帮助`);
  }
  if (!flags.calculate) {
    throw new Error(`必须指定 --calculate 或其别名 ${FLAG_ALIASES['calculate'].map(a => "--" + a).join(", ")}`);
  }
  const mode = Number(flags.mode);
  const rule = MODE_RULES[mode];
  if (!rule) return;
  if (!!rule.required) {
    for (const key of rule.required) {
      if (flags[key] === undefined) {
        throw new Error(`mode=${mode} 时必须传入 --${key} 或其别名 ${[FLAG_ALIASES[key].map(a => "--" + a)].join(", ")}`);
      }
    }
  }
  if (!!rule.validate) {
    rule.validate(flags);
  }
}

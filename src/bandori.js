// bandori.js
export default class Bandori {
  constructor(mod) {
    this.mode = mod | 0;
    this.coefficient = 0;
    this.base = 0;
    this.fire = 0;
    this.extra = 0;
    this.medley = 0;
    this.rank = 0;
    this.multiplier = 0;
    this.medleyBonus = null;
    this.team = 0;

    if (mod === 14) {
      this.medleyBonus = [0, 0, 0];
      this.medley = 1;
    }
    this.initialize(mod);
  }

  static show() {
    console.log(`公式:
pts = ([(底分+[单人得分/系数])*加成倍率]+[副队综合力/3000])*火倍率 | "["表示向下取整

模式:
1.普协
2.CP活(攒)
3.CP活(清)
4.对邦
5.EX活
6.课题
7.5v5
8.新CP活(攒)
9.新CP活(清)
10.新对邦
11.新EX活
12.新课题
13.新5v5
14.三组曲

limits:150w/750w/210w/262.5w
`);
  }

  initialize(mod) {
    switch (mod) {
      case 1: this.base = 50; this.coefficient = 10000; break;
      case 2: this.base = 20; this.coefficient = 25000; break;
      case 3: this.base = 1000; this.coefficient = 300; break;
      case 4: this.coefficient = 5500; break;
      case 5: this.base = 40; this.coefficient = 13000; break;
      case 6: this.base = 40; this.coefficient = 10000; break;
      case 7: this.base = 20; this.coefficient = 5500; break;
      case 8: this.base = 70; this.coefficient = 50000; break;
      case 9: this.base = 3250; this.coefficient = 450; break;
      case 10: this.coefficient = 6500; break;
      case 11: this.base = 130; this.coefficient = 26000; break;
      case 12: this.base = 120; this.coefficient = 15000; break;
      case 13: this.base = 50; this.coefficient = 6500; break;
      case 14: this.coefficient = 18500; break;
      default: throw new Error('Error: unknown mode'); break;
    }
  }

  // Boost 设置（mul 可以是整数或浮点；fir = 火数）
  boost(mul, fir = 0) {
    this.multiplier = Number(mul);
    this.fire = fir | 0;
  }

  // Medley 设置 （first, second, third, mdl）
  medleyBoost(firstx, secondx, thirdx, mdl) {
    this.medleyBonus = [firstx | 0, secondx | 0, thirdx | 0];
    this.medley = mdl | 0;
    this.base = -5 + 35 * this.medley;
  }

  // 内部：单曲/组曲火率设置
  fireSetUp2() {
    let count = 0;
    for (let i = 0; i < this.medley; i++) {
      count += this.fireSetUp(this.medleyBonus[i]);
    }
    this.fire = count;
  }

  fireSetUp(num) {
    if (!num) return 1;
    return num * 5;
  }

  // Num 用于 mode 特殊字段：对邦/5v5/三组曲的不同用法
  numSetUp(num) {
    if (this.mode === 4 || this.mode === 10) {
      this.rank = num;
    } else if (this.mode === 7 || this.mode === 13) {
      if (num - this.mode * 10 > 0) this.team = this.mode === 7 ? 50 : 125;
      this.rank = num - this.team;
    } else if (this.mode === 14) {
      this.base = num;
      this.medley = 4 - Math.floor(170 / (num + 20));
    } else {
      this.extra = num;
    }
  }

  // 对外调用：Calculate(pts, num?) 或 Calculate(pts)
  calculate(pts, num) {
    let logs = [];

    if (num !== undefined) this.numSetUp(num);
    if (this.mode === 6 || this.mode === 12) {
      logs.push(`副队综合力 ${this.extra},`);
    }
    if (this.mode === 7 || this.mode === 13) {
      logs.push(`5v5团队live状态: ${!this.team ? '落败' : '胜利'}`);
    }
    if (this.mode !== 14) {
      logs.push(`目标点数 ${pts}; ${this.fire} 火, ${Math.floor(this.multiplier * 100 + 0.1)}% 加成:`);
    }
    this.multiplier = this.multiplier + 1;
    this.extra = Math.floor(this.extra / 3000);
    if (this.mode === 14) {
      this.fireSetUp2();
    } else {
      this.fire = this.fireSetUp(this.fire);
    }
    if (this.mode === 14) {
      const adjusted = Array.from({ length: this.medley }, (_, i) => this.medleyBonus[i] || 0);
      logs.push(`目标点数 ${pts}; ${JSON.stringify(adjusted)} 火 (${this.fire}倍得分):`);
    }

    this.base += this.rank;
    this.base += this.team;

    if (pts % this.fire !== 0) {
      logs.push('火焰倍数不符合要求.\n');
      return this.finalix(logs.join('\n'));
    } else {
      pts = Math.floor(pts / this.fire);
    }

    pts = pts - this.extra;

    // 检查提示线
    if (Math.floor((this.base + Math.floor(2625000 / this.coefficient)) * this.multiplier) < pts) {
      logs.push('所需分数>262.5w, 请注意.');
    } else if (Math.floor((this.base + Math.floor(1500000 / this.coefficient)) * this.multiplier) < pts) {
      logs.push('所需分数>150w, 请注意.');
    }

    // 计算 min/max
    const mult = this.multiplier;
    const base = this.base;
    let min, max;

    // 辅助：检测 pts 是否为 floor((floor(pts/mult)*mult))
    const cond1 = Math.floor((Math.floor(pts / mult) * mult)) === pts;
    const cond2 = Math.floor((Math.floor(pts / mult + 1) * mult)) === pts;

    if (cond1) {
      min = Math.floor(pts / mult - base) * this.coefficient;
      max = min + this.coefficient - 1;
      if (min < 0) {
        logs.push('目标点数过少或火率太高, 无法控分.\n');
        return this.finalix(logs.join('\n'));
      }
      logs.push(`${min} - ${max}.\n`);
    } else if (cond2) {
      min = Math.floor(pts / mult + 1 - base) * this.coefficient;
      max = min + this.coefficient - 1;
      if (min < 0) {
        logs.push('目标点数过少或火率太高, 无法控分.\n');
        return this.finalix(logs.join('\n'));
      }
      logs.push(`${min} - ${max}.\n`);
    } else {
      logs.push('无法控分; 请调整各项参数后重试.\n');
    }

    return this.finalix(logs.join('\n'));
  }

  finalix(msg) {
    // Revert Instance Variables
    this.fire = Math.floor(this.fire / 5);
    this.multiplier = this.multiplier - 1;
    if (this.mode === 14) {
      this.fire = 0;
      this.medley = 1;
    }
    this.base -= this.rank;
    this.rank = 0;

    // Console Logs
    console.log(msg);
    return msg;
  }

  // DualSemiAuto 及计算辅助
  dualSemiAutoCalc(pts, altn) {
    if (pts % this.fire !== 0 || altn % this.fire !== 0) return null;
    pts = Math.floor(pts / this.fire);
    altn = Math.floor(altn / this.fire);
    pts -= this.extra;
    altn -= this.extra;

    if (Math.floor((this.base + Math.floor(2625000 / this.coefficient)) * this.multiplier) < pts
      || Math.floor((this.base + Math.floor(2625000 / this.coefficient)) * this.multiplier) < altn) {
      return null;
    }

    // helper to check and compute min
    const tryMin = (val) => {
      if ((Math.floor(val / this.multiplier) * this.multiplier) === val) {
        const m = Math.floor(val / this.multiplier - this.base) * this.coefficient;
        if (m < 0) return null;
        return m;
      } else if ((Math.floor(val / this.multiplier + 1) * this.multiplier) === val) {
        const m = Math.floor(val / this.multiplier + 1 - this.base) * this.coefficient;
        if (m < 0) return null;
        return m;
      }
      return null;
    };

    const min1 = tryMin(pts);
    if (min1 === null) return null;
    const min2 = tryMin(altn);
    if (min2 === null) return null;
    return (pts + this.extra) * this.fire;
  }

  dualSemiAuto(pts, varCenter, atmptOrNum, atmptIfNum) {
    // Overloads in Java: dualSemiAuto(pts,num,var,atmpt) or dualSemiAuto(pts,var,atmpt)
    // We'll detect argument lengths by types:
    if (typeof atmptIfNum !== 'undefined') {
      // signature: (pts, num, var, atmpt)
      const num = varCenter | 0;
      const v = atmptOrNum | 0;
      const atmpt = atmptIfNum | 0;
      this.numSetUp(num);
      return this._dualSemiAutoInner(pts, v, atmpt);
    } else {
      // signature: (pts, var, atmpt)
      const v = varCenter | 0;
      const atmpt = atmptOrNum | 0;
      return this._dualSemiAutoInner(pts, v, atmpt);
    }
  }

  _dualSemiAutoInner(pts, v, atmpt) {
    const successList = [];
    this.multiplier = this.multiplier + 1;
    this.extra = Math.floor(this.extra / 3000);
    if (this.mode === 14) this.fireSetUp2(); else this.fire = this.fireSetUp(this.fire);

    if ((this.mode === 7 || this.mode === 13) && this.rank === 0) this.rank = 100;
    this.base += this.rank;

    for (let i = v - atmpt; i <= v + atmpt; i++) {
      const res = this.dualSemiAutoCalc(i, pts - i);
      if (res !== null) successList.push(res);
    }

    console.log(JSON.stringify(successList));
    this.finalix();
    return successList;
  }
}

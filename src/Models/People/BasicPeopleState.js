class BasicPeopleState {
  constructor(options, eqConsts) {
    this.p = options.p;
    this.mu = options.mu;
    this.immunizedType = options.immunizedType;
    this.diff = 0;

    if (eqConsts) {
      for (const [key, val] of Object.entries(eqConsts)) {
        this[key] = val;
      }
    }
  }

  applyDiff() {
    //diffとdeathsをpopulationに反映し、リセットする
    this.p += this.diff;

    //diffをリセット
    this.diff = 0;
  }

  setDiff(diffVal, activateMu = true) {
    if (isNaN(diffVal))
      throw new Error(`error at ${this.ID}.setDiff() : diffVal が NaN です。`);

    //本フェーズの死者数
    const deaths = this.mu * this.p;

    //計算結果チェック
    if (diffVal + this.p < 0)
      throw new Error(
        `error at ${this.ID}.setDiff() : diffVal + this.pop が負になりました。`
      );

    if (diffVal - deaths + this.p < 0)
      throw new Error(
        `error at ${this.ID}.setDiff() : diffVal - deaths + this.pop が負になりました。`
      );

    //ライフサイクルにおける死亡者数を計算し、自動的に差分に反映
    //return value: diff
    return (this.diff = diffVal - deaths);
  }
}

module.exports = { BasicPeopleState };

export class BasicPeopleState {
  public immunizedType: string[];
  public _p: number;
  public _diff: number;

  constructor(options: { immunizedType: string[] }) {
    this._p = 0;
    this.immunizedType = options.immunizedType;
    this._diff = 0;
  }

  applyDiff() {
    //diffとdeathsをpopulationに反映し、リセットする
    this.p += this.diff;

    //diffをリセット
    this.diff = 0;
  }

  /**
   * setter/getterを定義：整数値で計算結果を格納する
   * 正負のそれぞれの値に対する挙動が一貫しているMath.round()を使用
   */

  set diff(val: number) {
    this._diff = Math.round(val);
  }

  get diff() {
    return this._diff;
  }

  //pのsetter
  set p(val: number) {
    this._p = Math.round(val);
  }

  //pのgetter
  get p() {
    return this._p;
  }
}

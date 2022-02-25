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

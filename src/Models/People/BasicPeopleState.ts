export class BasicPeopleState {
  public immunizedType: string[];
  public _p: number;
  public diff: number;

  constructor(options: { immunizedType: string[] }) {
    this._p = 0;
    this.immunizedType = options.immunizedType;
    this.diff = 0;
  }

  applyDiff() {
    //diffとdeathsをpopulationに反映し、リセットする
    this.p += this.diff;

    //diffをリセット
    this.diff = 0;
  }

  //pのsetter
  set p(val: number) {
    this._p = val;
  }

  //pのgetter
  get p() {
    return this._p;
  }
}

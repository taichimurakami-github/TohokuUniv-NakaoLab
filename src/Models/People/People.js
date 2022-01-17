const { DefinePeopleStates } = require("./DefinePeopleStates");

/**
 * class People
 * PeopleStatesHolderに各種関数を実装
 * 全てのPeopleStates, 各種handler関数が実装済み
 * 計算には基本的にこれを用いる
 */
class People extends DefinePeopleStates {
  constructor(config, initialPop) {
    super();
    this.config = config;
    //渡された初期人口を設定
    for (const [id, value] of Object.entries(initialPop)) {
      this[id].pop = value;
    }
  }

  //1. 時間を設定
  //2. 各フェーズ特有のイベントを実行、人口分布の変化も行う
  updateWithCycleStart() {
    //時間をセットする
    this.t += 1;
    const t_m = this.config.params.mutationBeginTime;

    //モデルに定義されるイベントを実行する
    switch (this.t) {
      //ウイルス変異に伴うパラメータ群の調整
      //RM -> Sへの遷移開始
      case t_m: {
        this.beginMutate();
        break;
      }

      //ウイルス変異に伴うパラメータの調整（I_REM_M, I_REM_E）
      //R_EM -> R_E, R_Mへの遷移開始
      //変異が起きた次のステップで発生する
      case t_m + 5: {
        this.beginNewStrainFeedback();
        break;
      }

      default:
    }
  }

  //1. 計算結果である差分を適用
  //2. 差分適用後の状態を記録
  updateWithCycleEnd() {
    //記録していた差分を反映する
    for (const ID of this.getAllIDsArr()) {
      this[ID].applyDiff();
    }

    //記録を行う
    this.recordNowState();
  }

  //変異株の出現を実行
  beginMutate() {
    //外部からの流入を開始
    const fromOutside = 100;
    this.I_M.pop += fromOutside;
    this.I_RE_M.pop += fromOutside;

    //I_E -> I_Mの変異開始(変異率：1%)
    this.I_E.epsilon = 0.01;

    //S -> I_Mの遷移開始
    this.S.beta.M = 0.75;

    //R_E -> I_RE_Mの遷移開始
    this.R_E.beta.M = 0.6;
  }

  //免疫低下によるフィードバックを実行
  beginNewStrainFeedback() {
    this.R_EM.sigma.R_E = 0.05;
    this.R_EM.sigma.R_M = 0.05;
  }

  getAllIDsArr() {
    //this.structのid配列を全て展開する
    return Object.values(this.struct).reduce(
      (prevResult, currentVal) => [...prevResult, ...currentVal],
      []
    );
  }

  getSum(group = "") {
    let IdGroupArr;
    switch (group) {
      case "E":
        IdGroupArr = ["I_E", "I_RE_E", "I_RM_E", "I_REM_E"];
        break;

      case "M":
        IdGroupArr = ["I_M", "I_RE_M", "I_RM_M", "I_REM_M"];
        break;

      default:
        IdGroupArr = this.struct[group]
          ? [...this.struct[group]]
          : this.getAllIDsArr();
    }

    return IdGroupArr.reduce((prevResult, current) => {
      //immunizedTypeが指定されていて、かつ感染抑制係数thetaを持っている場合はthetaをかける
      const v =
        this[current]?.immunized && this[theta]
          ? this.theta[this[current].immunized]
          : 1;

      return prevResult + this[current].pop * v;
    }, 0);
  }

  recordNowState() {
    const thisTimeArrayOfPop = [];
    const thisTimeArrayOfObj = {};

    for (const ID of this.getAllIDsArr()) {
      const targetPop = this[ID].pop;
      thisTimeArrayOfPop.push(targetPop);
      thisTimeArrayOfObj[ID] = targetPop;
    }

    //sum_E, sum_Mを追加
    const sum_E = this.getSum("E");
    const sum_M = this.getSum("M");
    thisTimeArrayOfPop.push(sum_E);
    thisTimeArrayOfPop.push(sum_M);
    thisTimeArrayOfObj.sum_I_EX = sum_E;
    thisTimeArrayOfObj.sum_I_MX = sum_M;

    //sum_E, sum_Mを入れたものをresult.ArrayOf~~に代入
    this.result.ArrayOfPop.push(thisTimeArrayOfPop);
    this.result.ArrayOfObj.push(thisTimeArrayOfObj);
  }
}

module.exports = { People };

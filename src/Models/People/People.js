const { DefinePeopleStates } = require("./DefinePeopleStates");

// const getInfectionCoeff = (beta, activityDist) => {
//   //感染率をそれぞれ定義
//   const high = (beta * (1 - beta)) / 2;
//   const mid = beta;
//   const low = beta * 0.2;

//   //beta * activityDist.stateの和を返す
//   return (
//     high * activityDist.high + mid * activityDist.mid + low * activityDist.low
//   );
// };

// const getActivityDist = () => {
//   return {
//     high: 0,
//     mid: 0,
//     low: 0,
//   };
// };

const societyConfig = {
  alertLevel: {
    max: 10,
    min: 0,
  },
};

/**
 * class People
 * PeopleStatesHolderに各種関数を実装
 * 全てのPeopleStates, 各種handler関数が実装済み
 * 計算には基本的にこれを用いる
 */
class People extends DefinePeopleStates {
  constructor(config) {
    this.config = config;
    this.society = {
      alertLevel: 0,
    };
  }

  //変異株の出現を実行
  beginMutate() {
    //外部からの流入を開始
    const fromOutside = 100;
    this.I_M.pop += fromOutside;
    this.R_E.pop -= fromOutside;
    this.I_RE_M.pop += fromOutside;

    //I_E -> I_Mの変異開始(変異率：1%)
    this.I_E.epsilon = 0.01;

    //S -> I_Mの遷移開始
    this.S.beta.M = 0.85;

    //R_E -> I_RE_Mの遷移開始
    this.R_E.beta.M = 0.6;
  }

  //免疫低下によるフィードバックを実行
  beginNewStrainFeedback() {
    this.R_EM.sigma.R_E = 0.05;
    this.R_EM.sigma.R_M = 0.05;
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
          : [...this.struct.S, ...this.struct.I, ...this.struct.R];
    }

    return IdGroupArr.reduce(
      (prevResult, current) => prevResult + this[current].pop,
      0
    );
  }

  recordNowState() {
    const IdStructArr = [...this.struct.S, ...this.struct.I, ...this.struct.R];
    const thisTimeArrayOfPop = [];
    const thisTimeArrayOfObj = {};
    let sum_E = 0,
      sum_M = 0;
    for (const ID of IdStructArr) {
      const targetPop = this[ID].pop;
      thisTimeArrayOfPop.push(targetPop);
      thisTimeArrayOfObj[ID] = targetPop;

      //sum_E, sum_Mの合計を計算
      if (this[ID].type === "I" && this[ID].strainType === "E") {
        sum_E += targetPop;
      }
      if (this[ID].type === "I" && this[ID].strainType === "M") {
        sum_M += targetPop;
      }
    }

    //sum_E, sum_Mを追加
    thisTimeArrayOfPop.push(sum_E);
    thisTimeArrayOfPop.push(sum_M);
    thisTimeArrayOfObj.sum_I_EX = sum_E;
    thisTimeArrayOfObj.sum_I_MX = sum_M;

    //sum_E, sum_Mを入れたものをresult.ArrayOf~~に代入
    this.result.ArrayOfPop.push(thisTimeArrayOfPop);
    this.result.ArrayOfObj.push(thisTimeArrayOfObj);
  }

  changeSocietyVars() {
    const recentInfectiousNumbers = [];

    //直近 config.societyCheckDepth 回分の感染者合計結果を取得
    for (let i = this.config.societyCheckDepth; i >= 0; i--) {
      recentInfectiousNumbers.push(
        this.result.ArrayOfObj[id].sum_I_EX +
          this.result.ArrayOfObj[id].sum_I_MX
      );
    }

    //それぞれの差分を出す -> recentInfectiousDiffs[]に保存
    const recentInfectiousDiffs = [];
    for (let i = recentInfectiousNumbers.length; i > 0; i--) {
      recentInfectiousDiffs.push(
        recentInfectiousNumbers[i] - recentInfectiousNumbers[i - 1]
      );
    }
  }

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

  updateWithCycleEnd() {
    //記録していた差分を反映する
    for (const ID of [...this.struct.S, ...this.struct.I, ...this.struct.R]) {
      this[ID].applyDiff();
    }

    //記録を行う
    this.recordNowState();
  }
}

module.exports = { People };

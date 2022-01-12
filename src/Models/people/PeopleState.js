const { initialEqConst } = require("../../const");
const { Infectious } = require("./InfectiousClass");
const { Recovered } = require("./RecoveredClass");
const { Susceptible } = require("./SusceptibleClass");
const { initialEqState } = require("../../state");

/**
 * structure and settings
 */
const peopleBasicStateStruct = {
  S: ["S"],
  I: [
    "I_E",
    "I_M",
    "I_RE_E",
    "I_RE_M",
    "I_RM_E",
    "I_RM_M",
    "I_REM_E",
    "I_REM_M",
  ],
  R: ["R_E", "R_M", "R_M"],
};

const strainTypes = {
  "001": "E",
  "002": "M",
};

/**
 * class PeopleState
 *
 * 人々の状態を管理する
 */
class PeopleStates {
  constructor(config) {
    this.struct = { ...peopleBasicStateStruct };
    this.t = 0; //時間
    this.config = config;
    this.result = {
      ArrayOfPop: [],
      ArrayOfObj: [],
    };

    /**
     * Susceptible class instance generation
     */
    this.S = new Susceptible("S", initialEqState.S, {
      beta: {
        [strainTypes["001"]]: initialEqConst.beta_E, //beta.E
        [strainTypes["002"]]: initialEqConst.beta_M, //beta.M
      },
      mu: initialEqConst.mu_S,
    });

    /**
     * Infection class instance generation
     */

    //E系
    this.I_E = new Infectious(
      "I_E",
      initialEqState.I_E,
      strainTypes["001"], //strain E
      "", //never immunized
      {
        beta: {
          [strainTypes["002"]]: initialEqConst.epsilon_EM,
        },
        gamma: {
          [strainTypes["001"]]: initialEqConst.gamma_E, //recover to R_E
        },
        mu: initialEqConst.mu_E,
      }
    );

    this.I_RE_E = new Infectious(
      "I_RE_E",
      initialEqState.I_RE_E,
      strainTypes["001"], //strain E
      strainTypes["002"], //type E immunized
      {
        gamma: {
          [strainTypes["001"]]: initialEqConst.gamma_RE_E, //recover to R_E
        },
        mu: initialEqConst.mu_RE_E,
      }
    );

    this.I_RE_M = new Infectious(
      "I_RE_M",
      initialEqState.I_RE_M,
      strainTypes["002"], //strain M
      strainTypes["002"], //type E immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_RE_M, //recover to R_EM
        },
        mu: initialEqConst.mu_RE_M,
      }
    );

    //M系
    this.I_M = new Infectious(
      "I_M",
      initialEqState.I_M,
      strainTypes["002"], //strain M
      "", //never immunized
      {
        gamma: {
          [strainTypes["002"]]: initialEqConst.gamma_M, //recover to R_M
        },
        mu: initialEqConst.mu_M,
      }
    );

    this.I_RM_M = new Infectious(
      "I_RM_M",
      initialEqState.I_RM_M,
      strainTypes["002"], //strain M
      strainTypes["002"], //type M immunized
      {
        gamma: {
          [strainTypes["002"]]: initialEqConst.gamma_RM_M, //recover to R_M
        },
        mu: initialEqConst.mu_RM_M,
      }
    );

    this.I_RM_E = new Infectious(
      "I_RM_E",
      initialEqState.I_RM_E,
      strainTypes["001"], //strain E
      strainTypes["002"], //type M immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_RM_E, //recover to R_EM
        },
        mu: initialEqConst.mu_RM_E,
      }
    );

    //EM系
    this.I_REM_E = new Infectious(
      "I_REM_E",
      initialEqState.I_REM_E,
      strainTypes["001"], //strain E
      strainTypes["001"] + strainTypes["002"], //type E and M immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_REM_E, //recover to R_EM
        },
        mu: initialEqConst.mu_REM_E,
      }
    );

    this.I_REM_M = new Infectious(
      "I_REM_M",
      initialEqState.I_REM_M,
      strainTypes["002"], //strain M
      strainTypes["001"] + strainTypes["002"], //type E and M immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_REM_M, //recover to R_EM
        },
        mu: initialEqConst.mu_REM_M,
      }
    );

    /**
     * Recovered class instance generation
     */
    this.R_E = new Recovered("R_E", initialEqState.R_E, strainTypes["001"], {
      beta: {
        [strainTypes["001"]]: initialEqConst.beta_RE_E,
        [strainTypes["002"]]: initialEqConst.beta_RE_M,
      },
      sigma: {
        ["S"]: initialEqConst.sigma_RE_S,
      },
      mu: initialEqConst.mu_RE,
    });

    this.R_M = new Recovered("R_M", initialEqState.R_E, strainTypes["002"], {
      beta: {
        [strainTypes["001"]]: initialEqConst.beta_RM_E,
        [strainTypes["002"]]: initialEqConst.beta_RM_M,
      },
      sigma: {
        ["S"]: initialEqConst.sigma_RM_S,
      },
      mu: initialEqConst.mu_RM,
    });

    this.R_EM = new Recovered(
      "R_EM",
      initialEqState.R_E,
      strainTypes["001"] + strainTypes["002"],
      {
        beta: {
          [strainTypes["001"]]: initialEqConst.beta_REM_E,
          [strainTypes["002"]]: initialEqConst.beta_REM_M,
        },
        sigma: {
          ["R_E"]: initialEqConst.sigma_REM_RE,
          ["R_M"]: initialEqConst.sigma_REM_RM,
        },
        mu: initialEqConst.mu_RE_M,
      }
    );
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
  beginFeedback() {
    this.R_E.sigma.S = 0.05; //R_E >> S
    this.R_M.sigma.S = 0.05;
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

  updateWithCycleStart() {
    //時間をセットする
    this.t += 1;
    const t_m = this.config.params.mutationBeginTime;

    //モデルに定義されるイベントを実行する
    switch (this.t) {
      //ウイルス変異に伴うパラメータ群の調整
      //RM -> Sへの遷移開始
      case t_m: {
        console.log("begin mutation");
        this.beginMutate();
        break;
      }

      //ウイルス変異に伴うパラメータの調整（I_REM_M, I_REM_E）
      //R_EM -> R_E, R_Mへの遷移開始
      //変異が起きた次のステップで発生する
      case t_m + 5: {
        this.beginFeedback();
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

module.exports = { PeopleStates };

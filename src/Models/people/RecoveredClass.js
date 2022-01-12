const { BasicPeopleState } = require("./BasicPeopleState");

/**
 * PeopleStateModel.Recovered
 *
 * <class variables>
 * type: モデルタイプ
 * immunized: 獲得済み免疫タイプ
 *
 */
class Recovered extends BasicPeopleState {
  constructor(ID, initialPopulation, immunizedType, eqConsts = {}) {
    super(ID, initialPopulation, eqConsts);
    this.immunizedType = immunizedType;
  }

  changeTo(target, sum, sum_infected) {
    switch (target.type) {
      //感染状態への移行
      case "I":
        return (this.pop * this.beta[target.strainType] * sum_infected) / sum;

      //sigmaによるフィードバック分
      case "S":
      case "R":
        return this.pop * this.sigma[target.ID];

      default:
        throw new Error(
          "error at " + this.ID + ".getDiff : invalid target type"
        );
    }
    // switch (target.ID) {
    //   /**
    //    * R_E
    //    */
    //   case "I_RE_E": //R_E >> I_RE_E
    //     return (this.pop * this.beta_RE_E * sum_infected) / sum;

    //   case "I_RE_M": //R_E >> I_RE_M
    //     return (this.pop * this.beta_RE_M * sum_infected) / sum;

    //   /**
    //    * R_M
    //    */
    //   case "I_RM_M": //R_M >> I_RM_M
    //     return (this.pop * this.beta_RM_M * sum_infected) / sum;

    //   case "I_RM_E": //R_M >> I_RM_E
    //     return (this.pop * this.beta_RM_E * sum_infected) / sum;

    //   /**
    //    * R_EM
    //    */
    //   case "I_REM_E": //R_EM >> I_REM_E
    //     return (this.pop * this.beta_REM_E * sum_infected) / sum;

    //   case "I_REM_M": //R_EM >> I_REM_M
    //     return (this.pop * this.beta_REM_M * sum_infected) / sum;

    //   case "R_E": //R_EM >> R_E
    //     return this.pop * sigma_REM_E;

    //   case "R_M": //R_EM >> R_E
    //     return this.pop * sitma_REM_M;

    //   /**
    //    * common betwoon R_E and R_M(back to S)
    //    */
    //   case "S": //R_E >> S or R_M >> S
    //     //this.typeによってsigmaの値が異なる
    //     if (this.ID === "R_E") return this.pop * this.sigma_RE_S;
    //     if (this.ID === "R_M") return this.pop * this.sigma_RM_S;
    //     throw new Error("error at Recovered getDiff case S");

    //   default:
    //     throw new Error(this.type + " : target.typeが不正です。");
    // }
  }
}

module.exports = { Recovered };

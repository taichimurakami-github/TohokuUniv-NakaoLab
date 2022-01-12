const { BasicPeopleState } = require("./BasicPeopleState");

/**
 * PeopleStateModel.Infectious
 *
 * <class variables>
 * type: モデルタイプ
 * immunizedType: 獲得済み免疫タイプ
 * strainType: 変異型の種類
 *
 */
class Infectious extends BasicPeopleState {
  constructor(ID, initialPopulation, strainType, immunizedType, eqConsts) {
    super(ID, initialPopulation, eqConsts);
    this.strainType = strainType; //変異型
    this.immunizedType = immunizedType;
  }

  changeTo(target, sum, sum_infected) {
    switch (target.type) {
      case "I": //今のところI_E -> I_M のみ
        return (this.pop * this.beta[target.strainType] * sum_infected) / sum;

      case "R":
        return this.pop * this.gamma[target.immunizedType];

      default:
        throw new Error(
          "error at " + this.ID + ".getDiff : invalid target type"
        );
    }

    // switch (target.ID) {
    //   /**
    //    * I_E
    //    */
    //   case "R_E": //I_E >> R_E
    //     if (this.ID === "I_E") return this.pop * this.gamma_E;
    //     if (this.ID === "I_RE_E") return this.pop * this.gamma_RE_E;
    //     throw new Error("error at Infectious getDiff case R_E");

    //   case "I_M": //I_E >> I_M
    //     return this.pop * this.epsilon_EM;

    //   /**
    //    * I_M
    //    */
    //   case "R_M":
    //     return this.pop * this.gamma_M;

    //   /**
    //    * I_RE_M or I_RM_E
    //    */
    //   case "R_EM":
    //     if (this.ID === "I_RE_M") return this.pop * this.gamma;
    //     if (this.ID === "I_RM_E") return this.pop * this.gamma;
    //     throw new Error("error at Infectious getDiff case R_EM");

    //   /**
    //    *
    //    */

    //   default:
    //     throw new Error(this.type + " : target.typeが不正です。");
    // }
  }
}

module.exports = { Infectious };

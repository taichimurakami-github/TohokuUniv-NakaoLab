const { BasicPeopleState } = require("./BasicPeopleState");

/**
 * PeopleStateModel.Susceptible
 *
 * <class variables>
 * type: モデルタイプ
 * immunizedType: 獲得済み免疫タイプ
 * strainType: 変異型の種類
 *
 */
class Susceptible extends BasicPeopleState {
  constructor(ID, initialPopulation, eqConsts) {
    super(ID, initialPopulation, eqConsts);
  }

  changeTo(target, sum, sum_infected) {
    return (this.pop * this.beta[target.strainType] * sum_infected) / sum;
    // switch (target.type) {
    //   case "I_E": //S >> I_E
    //     return (this.beta_E * this.pop * sum_infected) / sum;

    //   case "I_M": //S >> I_M
    //     return (this.beta_M * this.pop * sum_infected) / sum;

    //   default:
    //     throw new Error(this.type + " : target.typeが不正です。");
    // }
  }
}

module.exports = { Susceptible };

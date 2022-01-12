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
  }
}

module.exports = { Susceptible };

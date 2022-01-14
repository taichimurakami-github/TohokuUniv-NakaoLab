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
    const beta = this.getVariableBeta(
      sum.I,
      sum.ALL
    )(this.beta[target.strainType]);
    return (this.pop * beta * sum_infected) / sum.ALL;
  }
}

module.exports = { Susceptible };

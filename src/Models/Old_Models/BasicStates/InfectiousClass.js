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
  constructor(ID, initialPopulation, strainType, eqConsts) {
    super(ID, initialPopulation, eqConsts);
    this.strainType = strainType; //変異型
  }

  changeTo(target, sum, sum_infected) {
    switch (target.type) {
      //今のところI_E -> I_M のみ
      case "I": {
        const beta = this.getVariableBeta(
          sum.ALL,
          sum.I
        )(this.beta[target.strainType]);
        return (this.pop * beta * sum_infected) / sum.ALL;
      }
      case "R": {
        return this.pop * this.gamma[target.immunizedType];
      }
      default:
        throw new Error(
          "error at " + this.ID + ".getDiff : invalid target type"
        );
    }
  }
}

module.exports = { Infectious };

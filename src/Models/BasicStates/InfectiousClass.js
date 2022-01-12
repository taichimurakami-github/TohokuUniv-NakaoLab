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
  }
}

module.exports = { Infectious };

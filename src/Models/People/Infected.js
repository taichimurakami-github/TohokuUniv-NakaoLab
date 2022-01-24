const { BasicPeopleState } = require("./BasicPeopleState");

class I extends BasicPeopleState {
  constructor(options, eqConsts) {
    super(options, eqConsts);
    //本クラスのカテゴライズタイプ
    this.type = "I";

    //感染しているウイルス株
    this.strainType = options.config.strainType;

    //感染関係の変数
    this.beta = this.getBeta(options.config.infectivity);
    this.gamma = this.getGamma(options.config.resilience);
    this.mu = this.getMu(options.config.fatarity);

    //再感染しているかどうかのフラグ
    this.reinfected = options.reinfected || false;
  }

  getBeta(initialInfectivity) {
    return initialInfectivity;
  }

  getGamma(initialResilience) {
    return initialResilience;
  }

  getMu(initialModarity) {
    return initialModarity;
  }
}

module.exports = { I };

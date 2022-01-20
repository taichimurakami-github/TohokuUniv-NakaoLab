const { BasicPeopleState } = require("./BasicPeopleState");

class I extends BasicPeopleState {
  constructor(options, eqConsts) {
    super(options, eqConsts);
    this.type = "I";
    // this.beta = options.beta;
    // this.gamma = options.gamma;
    this.strainType = options.config.strainType;
    this.beta = this.getBeta(options.config.infectivity);
    this.gamma = this.getGamma(options.config.resilience);
  }

  getBeta(initialInfectivity) {
    return initialInfectivity;
  }

  getGamma(initialResilience) {
    return initialResilience;
  }
}

module.exports = { I };

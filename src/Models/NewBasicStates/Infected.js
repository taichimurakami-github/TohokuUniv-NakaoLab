const { NewBasicPeopleState } = require("./NewBasicPeopleState");

class I extends NewBasicPeopleState {
  constructor(options, eqConsts) {
    super(options, eqConsts);
    this.gamma = options.gamma;
    this.strainType = options.strainType;
  }
}

module.exports = { I };

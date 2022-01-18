const { NewBasicPeopleState } = require("./NewBasicPeopleState");

class I extends NewBasicPeopleState {
  constructor(options) {
    super(options);
    this.gamma = options.gamma;
    this.strainType = options.strainType;
  }
}

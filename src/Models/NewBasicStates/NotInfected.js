const { NewBasicPeopleState } = require("./NewBasicPeopleState");

class NI extends NewBasicPeopleState {
  constructor(options) {
    super(options);
    this.beta = options.beta;
  }
}

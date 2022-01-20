const { BasicPeopleState } = require("./BasicPeopleState");

class NI extends BasicPeopleState {
  constructor(options) {
    super(options);
    this.type = "NI";
  }
}

module.exports = { NI };

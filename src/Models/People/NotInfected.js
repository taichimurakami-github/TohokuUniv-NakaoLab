const { BasicPeopleState } = require("./BasicPeopleState");

class NI extends BasicPeopleState {
  constructor(options) {
    super(options);
    this.type = "NI";
    this.birthRate = options.config.params.birthRate;
    this.mu = options.config.params.initialFatarity;
  }

  applyBirth() {
    this.p += this.p * this.birthRate;
  }

  applyBirthAndDeath() {
    if (this.immunizedType.length === 0) {
      // Sの場合 : 自然出生と感染以外が原因の死亡

      // this.p += this.p > 1000 ? this.p * (this.birthRate - this.mu) : 100;
      this.p += this.p * (this.birthRate - this.mu);
    } else {
      // その他NIの場合: 感染以外が原因の死亡のみ
      this.p -= this.p * this.mu;
    }
  }
}

module.exports = { NI };

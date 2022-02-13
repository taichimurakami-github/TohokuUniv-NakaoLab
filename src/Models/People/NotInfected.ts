import { BasicPeopleState } from "./BasicPeopleState";

export class R extends BasicPeopleState {
  public type: string;
  public mu: number;

  constructor(options: any) {
    super(options, undefined);
    this.type = "R";
    this.mu = options.config.params.initialFatarity;
  }
}

export class S extends R {
  public birthRate: number;

  constructor(options: any) {
    super(options);
    this.type = "S";
    this.birthRate = options.config.params.birthRate;
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

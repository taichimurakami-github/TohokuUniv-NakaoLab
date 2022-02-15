import { BasicPeopleState } from "./BasicPeopleState";

/**
 * SとRを兼用したクラス
 * S、Rは免疫を一つ以上保持しているかしていないかの差しかないので、
 * 一つに統合
 */
export class NI extends BasicPeopleState {
  public birthRate: number;
  public type: string;
  public mu: number;

  constructor(
    options: {
      immunizedType: string[];
      config: any;
    },
    initialBirthPopulation: number = 0
  ) {
    super(options);
    this.type = "NI";
    this.birthRate = options.config.params.birthRate;
    this.p = initialBirthPopulation;
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

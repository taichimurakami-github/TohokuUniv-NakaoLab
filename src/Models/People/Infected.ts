import { isValidAsCoeff } from "../../lib";
import { Config } from "../Config/Config";
import { type_VaccineLog } from "../Space/Space";
import { BasicPeopleState } from "./BasicPeopleState";

export class I extends BasicPeopleState {
  public strainType: string;
  public type: string;
  public beta: number;
  public gamma: number;
  public mu: number;
  public reinfected: boolean;

  constructor(options: {
    strainType: string;
    immunizedType: string[];
    Config: Config;
    reinfected: boolean;
  }) {
    super(options);
    //本クラスのカテゴライズタイプ
    this.type = "I";

    //感染しているウイルス株
    this.strainType = options.strainType;

    //感染関係の基礎パラメータ
    this.beta = options.Config.getVariantInfectivity(this.strainType);
    this.gamma = options.Config.getVariantResilience(this.strainType);
    this.mu = options.Config.getVariantFatality(this.strainType);

    //再感染しているかどうかのフラグ
    this.reinfected = options.reinfected;
  }

  /**
   * 状況に応じたbetaを計算して返す
   */
  getBeta(VaccineLog: type_VaccineLog, Config: Config) {
    return this.beta;
    return (
      this.getImmunizedEffectCoeff(Config) *
      this.getVaccinatedEffectCoeff("beta", VaccineLog) *
      this.beta
    );
  }

  //gammaが可変になる可能性があるので、ゲッターを定義しておく
  getGamma() {
    return this.gamma;
    // VirusModel: InstanceType<typeof Virus> // VaccineLog: type_VaccineLog, // mode: "infected" | "reinfected",
    return this.gamma;
    // switch (mode) {
    //   case "infected":

    //   case "reinfected":
    //     return this.getImmunizedEffectForGamma() * this.beta;

    //   default:
    //     return this.gamma;
    // }
  }

  //muが可変になる可能性があるので、ゲッターを定義しておく
  getMu() {
    return this.mu;
  }

  applyDeathByInfection() {
    this.p -= this.p * this.getMu();
  }

  /**
   * 交差免疫性を考慮し、感染力に乗ずる減衰値を返す
   * @param {String} strainType
   * @param {Array} immunizedType
   * @returns
   */
  getImmunizedEffectCoeff(Config: Config) {
    return this.immunizedType.reduce((prevResult, currentValue): number => {
      const immunizedEffect = Config.getCrossImmunity(
        currentValue, //獲得済み免疫
        this.strainType //現在感染しているウイルスタイプ
      );

      //獲得免疫効果との積を出す
      //無効な値だったらprevResultを返す
      return isValidAsCoeff(immunizedEffect)
        ? prevResult * immunizedEffect
        : prevResult;
    }, 1);
  }

  /**
   * 交差免疫性を考慮し、感染力に乗ずる減衰値を返す
   */
  getVaccinatedEffectCoeff(
    paramName: "beta" | "gamma" | "mu",
    VaccineLog: type_VaccineLog
  ) {
    return Object.keys(VaccineLog).reduce(
      (prevResult, currentValue): number => {
        //vaccine効果と、減衰率の積を出す
        const vaccinated = VaccineLog[currentValue];
        const effect = vaccinated.effect[this.strainType][paramName];
        const attenuationCoeff = vaccinated.attenuationCoeff;

        const vaccineEffect = effect * attenuationCoeff;
        vaccinated.effect[this.strainType][paramName] *
          vaccinated.attenuationCoeff;

        //ワクチンが複数存在する場合、すべてのattenuationRateの積を返す
        //計算結果が不正な場合、積を求めない
        return isValidAsCoeff(vaccineEffect)
          ? prevResult * vaccineEffect
          : prevResult;
      },
      1
    );
  }
}

export class E extends I {
  constructor(options: any) {
    super(options);
    this.type = "E";
  }
}

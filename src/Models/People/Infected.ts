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
    return (
      this.getImmunizedEffectCoeff(Config) *
      this.getVaccinatedEffectCoeff("beta", VaccineLog) *
      this.beta
    );
  }

  getGamma(VaccineLog: type_VaccineLog, Config: Config) {
    const MAX_GAMMA_CONST = 1;
    const calcResult =
      (2 - this.getImmunizedEffectCoeff(Config)) *
      this.getVaccinatedEffectCoeff("gamma", VaccineLog) *
      this.gamma;

    //gammaのオーバーフローチェック
    return calcResult > MAX_GAMMA_CONST ? MAX_GAMMA_CONST : calcResult;
  }

  getMu(VaccineLog: type_VaccineLog, Config: Config) {
    return (
      this.getImmunizedEffectCoeff(Config) *
      this.getVaccinatedEffectCoeff("mu", VaccineLog) *
      this.mu
    );
  }

  applyDeathByInfection(VaccineLog: type_VaccineLog, Config: Config) {
    this.p -= this.p * this.getMu(VaccineLog, Config);
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

        //attenuationCoeff == 0の場合、ワクチン効果切れ
        //これ以降の計算が無駄なので、終了する
        if (attenuationCoeff === 0) return prevResult;

        //gammaパラメータの場合
        if (paramName === "gamma") {
          const vaccineEffect = effect * attenuationCoeff;

          //gammaはワクチン効果が強いほど大きくなる
          //したがって、1を下回ったら逆に免疫ないときよりナイーブになってしまうので、
          //1を下回ったら強制的に1を返す
          return vaccineEffect > 1 ? vaccineEffect : 1;
        }

        //beta, muパラメータの場合
        else {
          const vaccineEffect = 1 - (1 - effect) * attenuationCoeff;

          //ワクチンが複数存在する場合、すべてのattenuationRateの積を返す
          //計算結果が不正な場合、積を求めない
          return isValidAsCoeff(vaccineEffect)
            ? prevResult * vaccineEffect
            : prevResult;
        }
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

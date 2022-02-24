import { type_VaccineLog } from "../Space/Space";
import { Virus } from "../Virus/Virus";
import { BasicPeopleState } from "./BasicPeopleState";

export class I extends BasicPeopleState {
  public strainType: string;
  public type: string;
  public beta: number;
  public gamma: number;
  public mu: number;
  public reinfected: boolean;

  constructor(options: any) {
    super(options);
    //本クラスのカテゴライズタイプ
    this.type = "I";

    //感染しているウイルス株
    this.strainType = options.VirusConfig.strainType;

    //感染関係の変数
    this.beta = options.VirusConfig.infectivity;
    this.gamma = options.VirusConfig.resilience;
    this.mu = options.VirusConfig.fatarity;

    //再感染しているかどうかのフラグ
    this.reinfected = options.reinfected || false;
  }

  /**
   * 状況に応じたbetaを計算して返す
   * @param {String} mode
   * @param {VirusModelObject} VirusModel
   * @returns
   */
  getBeta(
    mode: "infected" | "reinfected",
    VaccineLog: type_VaccineLog,
    VirusModel: InstanceType<typeof Virus>
  ) {
    const vaccineEffect = Object.keys(VaccineLog).reduce(
      (prevResult, currentValue): number => {
        //vaccine効果と、減衰率の積を出す
        const vaccinated = VaccineLog[currentValue];
        const vaccineEffectForBeta =
          vaccinated.effect[this.strainType].beta * vaccinated.attenuationCoeff;

        //ワクチンが複数存在する場合、すべてのattenuationRateの積を返す
        return prevResult * vaccineEffectForBeta;
      },
      1
    );
    switch (mode) {
      case "infected": {
        return (
          this.getCrossImmunityEffectForBeta(VirusModel) *
          vaccineEffect *
          this.beta
        );
      }

      case "reinfected":
        return (
          this.getImmunizedEffectForBeta() * //免疫獲得済み
          this.getCrossImmunityEffectForBeta(VirusModel) * //交差免疫の影響
          vaccineEffect * //ワクチン免疫の影響
          this.beta //基本感染力係数
        );

      default:
        throw new Error(
          `invarid mode at ${this.type}.getBeta(): mode = ${mode}`
        );
    }
  }

  //gammaが可変になる可能性があるので、ゲッターを定義しておく
  getGamma() {
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

  getImmunizedEffectForBeta() {
    return 0.1;
  }

  getImmunizedEffectForGamma() {
    return 1.05;
  }

  /**
   * 交差免疫性を考慮し、感染力に乗ずる減衰値を返す
   * @param {String} strainType
   * @param {Array} immunizedType
   * @returns
   */
  getCrossImmunityEffectForBeta(VirusModel: InstanceType<typeof Virus>) {
    let attenuationRate = 0;
    const attenuationRate_maxConst = 0.9;

    //免疫を保持しているウイルス株すべての交差免疫性の設定を読み出す
    for (const immunizedStrainType of this.immunizedType) {
      //免疫を保持するウイルス株のうち、一つの株の交差免疫性の設定を読み出す
      //交差免疫性が設定されていなければ、免疫減衰は発生しない
      //交差免疫性が設定されていれば、設定されている数値を引く
      attenuationRate += VirusModel.getCrossImmunity(
        immunizedStrainType,
        this.strainType
      );
    }

    //減衰値が最大値を超えていれば強制的に最大値に戻す
    if (attenuationRate_maxConst < attenuationRate)
      attenuationRate = attenuationRate_maxConst;

    //減衰値を返す（そのまま感染力に乗する）
    return 1 - attenuationRate;
  }
}

export class E extends I {
  constructor(options: any) {
    super(options);
    this.type = "E";
  }
}

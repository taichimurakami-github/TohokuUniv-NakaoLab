const { BasicPeopleState } = require("./BasicPeopleState");

class I extends BasicPeopleState {
  constructor(options, eqConsts) {
    super(options, eqConsts);
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
  getBeta(mode, VirusModel) {
    switch (mode) {
      case "infected":
        return this.getCrossImmunityEffectForBeta(VirusModel) * this.beta;

      case "reinfected":
        return this.getImmunizedEffectForBeta() * this.beta;

      default:
        return this.beta;
    }
  }

  //gammaが可変になる可能性があるので、ゲッターを定義しておく
  getGamma() {
    return this.gamma;
  }

  //muが可変になる可能性があるので、ゲッターを定義しておく
  getMu() {
    return this.mu;
  }

  applyDeathByInfection() {
    this.p -= this.p * this.getMu();
  }

  getImmunizedEffectForBeta() {
    return 0.5;
  }

  /**
   * 交差免疫性を考慮し、感染力に乗ずる減衰値を返す
   * @param {String} strainType
   * @param {Array} immunizedType
   * @returns
   */
  getCrossImmunityEffectForBeta(VirusModel) {
    let attenuationRate = 0;

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

    //減衰値が1を超えていればエラー
    if (1 < attenuationRate) {
      throw new Error(
        "Virus.getCrossImmunityEffect Error: 免疫交差性による減衰率の設定は、各ウイルスごとに合計値が１を下回るように設定してください。"
      );
    }

    //減衰値を返す（そのまま感染力に乗する）
    return 1 - attenuationRate;
  }
}

module.exports = { I };

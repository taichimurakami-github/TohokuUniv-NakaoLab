/**
 * Virus
 * + 変異株設定
 *
 */
class Virus {
  constructor(variantDefaults) {
    this.config = [...variantDefaults];
    this.strainTypesArr = this.getStrainTypesArr();
  }

  getStrainTypesArr() {
    return this.config.map((val) => val.strainType);
  }

  getStrainConfig(strainType) {
    if (strainType === "_INITIAL_STRAIN_") return this.config[0];
    for (const config of this.config) {
      if (config.strainType === strainType) return config;
    }
  }

  /**
   * 交差免疫性を考慮し、感染力に乗ずる減衰値を返す
   * @param {String} strainType
   * @param {Array} immunizedType
   * @returns
   */
  getCrossImmunityEffectForBeta(strainType, immunizedType) {
    let attenuationRate = 0;

    //免疫を保持しているウイルス株すべての交差免疫性の設定を読み出す
    for (const immunizedStrainType of immunizedType) {
      //免疫を保持するウイルス株のうち、一つの株の交差免疫性の設定を読み出す
      const config_virusCrossImmunity =
        this.getStrainConfig(immunizedStrainType).crossImmunity[strainType];

      //交差免疫性が設定されていなければ、免疫減衰は発生しない
      //交差免疫性が設定されていれば、設定されている数値を引く
      attenuationRate += config_virusCrossImmunity
        ? config_virusCrossImmunity
        : 0;
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

  getImmunizedEffectForBeta() {
    return 0.5;
  }
}

module.exports = { Virus };

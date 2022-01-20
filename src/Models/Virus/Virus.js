/**
 * Virus
 * + 変異株設定
 *
 */
class Virus {
  constructor(variantDefaults) {
    this.config = [...variantDefaults];
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
}

module.exports = { Virus };

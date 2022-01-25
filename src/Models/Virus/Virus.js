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

  getCrossImmunity(immunizedStrainType, reinfectedStrainType) {
    const result =
      this.config[immunizedStrainType]?.crossImmunity[reinfectedStrainType];
    return result || 0;
  }
}

module.exports = { Virus };

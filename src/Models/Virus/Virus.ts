/**
 * Virus
 * + 変異株設定
 *
 */
export class Virus {
  public config: any;
  readonly strainTypesArr: string[];

  constructor(variantDefaults: any) {
    this.config = [...variantDefaults];
    this.strainTypesArr = this.getStrainTypesArr();
  }

  public getStrainTypesArr() {
    return this.config.map((val: any) => val.strainType);
  }

  public getStrainConfig(strainType: string): any {
    if (strainType === "_INITIAL_STRAIN_") return this.config[0];
    for (const config of this.config) {
      if (config.strainType === strainType) return config;
    }
  }

  public getCrossImmunity(
    immunizedStrainType: string,
    reinfectedStrainType: string
  ): number {
    const result =
      this.config[immunizedStrainType]?.crossImmunity[reinfectedStrainType];
    return result || 0;
  }
}

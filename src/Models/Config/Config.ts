import { type_AllConfig, type_VariantConfig } from "../../../@types/config";

/**
 * Config getter
 */
export class Config {
  private config: type_AllConfig;

  constructor(config: type_AllConfig) {
    this.config = config;
  }

  //まとめて複数のconfigを取る
  public getAllConfig = () => this.config;

  public getVaccineConfig = () => this.config.vaccine;

  public getVirusConfig = () => this.config.variantConfig;

  public getIOConfig = () => this.config.io;

  //params
  public getTimeLength = () => this.config.params.timeLength;

  public getMaxTravelCoeffConst = () => this.config.params.maxTravelCoeff;

  public getMaxPopulationSize = () =>
    this.config.params.initialPopulationMaxSize;

  public getInitialBirthRate = () => this.config.params.birthRate;

  public getInitialInfectiousRate = () =>
    this.config.params.initialInfectiousRate;

  public getInitialFatality = () => this.config.params.initialFatarity;

  public getFeedbackRate = () => this.config.params.feedbackRate;

  //models
  public getSpaceConnectionType = () => this.config.params.spaceConnectionType;

  public getSpaceLength = () => this.config.params.spaceLength;

  public getInitialPopulation = () => this.config.params.initialPopulationRange;

  public getEI_transCoeff = (strainType: string) =>
    this.getVirusConfig()[strainType].EI_transCoeff;

  //vaccine
  public getVaccineSchedule = (n: number) =>
    this.config.vaccine.begin[String(n)];

  public getVaccineSetting = (vaccineName: string) =>
    this.config.vaccine.data[vaccineName];

  //variant
  public getVariantSetting = (strainType: string) =>
    this.config.variantConfig[strainType];

  public getStrainTypesArray = () => Object.keys(this.getVirusConfig());

  public getVariantInfectivity = (strainType: string) =>
    this.getVariantSetting(strainType).infectivity;

  public getVariantResilience = (strainType: string) =>
    this.getVariantSetting(strainType).resilience;

  public getVariantFatality = (strainType: string) =>
    this.getVariantSetting(strainType).fatality;

  public getCrossImmunity(
    immunizedStrainType: string,
    reinfectedStrainType: string
  ): number {
    //免疫を獲得済みの変異株の交差免疫情報の中から、
    //再感染した変異株に対する交差免疫性をセットする
    const result =
      this.getVariantSetting(immunizedStrainType).crossImmunity[
        reinfectedStrainType
      ];
    return result || 1.0;
  }
}

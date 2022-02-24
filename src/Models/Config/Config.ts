import { type_AllConfig, type_VariantConfig } from "../../../@types/config";

export class Config {
  private config: type_AllConfig;
  constructor(config: type_AllConfig) {
    this.config = config;
  }

  //まとめて複数のconfigを取る
  public getAllConfig = () => this.config;
  public getVaccineConfig = () => this.config.vaccine;
  public getIOConfig = () => this.config.io;

  //params
  public getTimeLength = () => this.config.params.timeLength;
  public getMaxTravelCoeffConst = () => this.config.params.maxCoeffConst;
  public getMaxPopulationSize = () => this.config.params.maxPopulationSize;
  public getInitialBirthRate = () => this.config.params.birthRate;
  public getInitialInfectiousRate = () =>
    this.config.params.initialInfectiousRate;
  public getInitialFatality = () => this.config.params.initialFatarity;
  public getFeedbackRate = () => this.config.params.feedbackRate;

  //models
  public getSpaceConnectionType = () => this.config.models.Space.connectionType;
  public getSpaceLength = () => this.config.models.Space.length;
  public getInitialPopulation = () =>
    this.config.models.People.initialPopulation;
  public getEI_transCoeff = () => this.config.models.People.EI_transCoeff;

  //vaccine
  public getVaccineSchedules = (n: number) =>
    this.config.vaccine.begin[String(n)];
  public getVaccineSetting = (vaccineName: string) =>
    this.config.vaccine.data[vaccineName];

  //variant
  public getVirusSettings = () => this.config.variantConfig;
}

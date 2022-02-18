//variantConfig
export type VariantConfig = {
  strainType: string;
  infectivity: number;
  resilience: number;
  fatarity: number;
  appearanceAt: number[];
  appearanceTime: number;
  crossImmunity: { [strainType: string]: number };
}[];

//vaccineConfig
export type VaccineEffects = {
  [strainType: string]: {
    [strainType: string]: number;
  };
};
export type VaccineData = {
  duration: number;
  effect: VaccineEffects;
};

export type VaccineConfig = {
  data: {
    [vaccineName: string]: VaccineData;
  };
  begin: {
    [time: string]: {
      name: string;
      target: number[] | "ALL";
    };
  };
};

//settings
export type ModelsConnectionTypeConfig = "partial" | "full";

export type SettingsConfig = {
  params: {
    [settingsName: string]: number;
  };
  models: {
    [modelName: string]: {
      connectionType: ModelsConnectionTypeConfig;
      length: {
        col: number;
        row: number;
      };
    };
  };
};

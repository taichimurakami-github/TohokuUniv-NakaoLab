//variantConfig
export type type_VariantConfig = {
  strainType: string;
  infectivity: number;
  resilience: number;
  fatarity: number;
  appearanceAt: number[];
  appearanceTime: number;
  crossImmunity: { [strainType: string]: number };
}[];

//vaccineConfig
export type type_VaccineEffects = {
  [strainType: string]: {
    [strainType: string]: number;
  };
};
export type type_VaccineData = {
  duration: number;
  effect: VaccineEffects;
};

export type type_VaccineConfig = {
  data: {
    [vaccineName: string]: type_VaccineData;
  };
  begin: {
    [time: string]: {
      name: string;
      target: number[] | "ALL";
    };
  };
};

//settings
export type type_ModelsConnectionTypeConfig = "partial" | "full";

export type type_SettingsConfig = {
  params: {
    [settingsName: string]: number;
  };
  models: {
    Space: {
      connectionType: type_ModelsConnectionTypeConfig;
      length: {
        col: number;
        row: number;
      };
    };
    People: {
      initialPopulation: { [key: string]: number };
      EI_transCoeff: number;
    };
  };
  io: {
    [key: string]: boolean;
  };
};

export type type_AllConfig = type_SettingsConfig & {
  variantConfig: type_VariantConfig;
  vaccine: type_VaccineConfig;
};

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
export type VaccineConfig = {
  name: string;
  begin: { time: number; space: number[] }[];
  effect: {
    [strainType: string]: {
      [strainType: string]: number;
    };
  };
}[];

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

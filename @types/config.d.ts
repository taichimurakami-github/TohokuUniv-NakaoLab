//variantConfig
export type type_VariantSetting = {
  strainType: string;
  EI_transCoeff: number;
  infectivity: number;
  resilience: number;
  fatality: number;
  appearanceAt: number[];
  appearanceTime: number;
  crossImmunity: {
    [strainType: string]: {
      beta: number;
      gamma: number;
      mu: number;
    };
  };
};

export type type_VariantConfig = {
  [strainType: string]: type_VariantSetting;
};

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
    timeLength: number;
    maxTravelCoeff: number;

    spaceConnectionType: "partial";
    spaceLength: {
      col: number;
      row: number;
    };

    birthRate: number;
    initialInfectiousRate: number; //いらない
    initialFatarity: number;
    feedbackRate: number; //R -> before Rへの遷移
    initialPopulationMaxSize: number;
    initialPopulationRange: {
      min: number;
      max: number;
    };

    infectiousActivityRate: number;
  };
  io: {
    [key: string]: boolean;
  };
};

export type type_AllConfig = type_SettingsConfig & {
  variantConfig: type_VariantConfig;
  vaccine: type_VaccineConfig;
};

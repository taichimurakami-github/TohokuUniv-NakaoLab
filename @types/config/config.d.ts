type variantConfig = {
  strainType: string;
  infectivity: number;
  resilience: number;
  fatarity: number;
  appearanceAt: number[];
  appearanceTime: number;
  crossImmunity: { [strainType: string]: number };
}[];

type vaccineConfig = {
  name: string;
  begin: { time: number; space: number[] }[];
  effect: {
    [strainType: string]: {
      [strainType: string]: number;
    };
  };
}[];

type settings = {
  params: {
    [settingsName: string]: number;
  };
  models: {
    [modelName: string]: {
      connectionType: "partial" | "full";
      length: {
        col: number;
        row: number;
      };
    };
  };
};

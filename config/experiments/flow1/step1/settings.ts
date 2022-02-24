import { type_SettingsConfig } from "../../../../@types/config";

const settings: type_SettingsConfig = {
  params: {
    timeLength: 1000,
    maxCoeffConst: 0,
    maxPopulationSize: 1000000,
    birthRate: 0,
    initialInfectiousRate: 0.001,
    initialFatarity: 0,
    feedbackRate: 0, //R -> before Rへの遷移
  },
  models: {
    Space: {
      connectionType: "partial",
      length: {
        col: 2,
        row: 2,
      },
    },
    People: {
      initialPopulation: {
        min: 1.0,
        max: 1.0,
      },
      EI_transCoeff: 0.4,
    },
  },
  io: {
    writeResultAsXLSX: false,
    writeResultAsJSON: true,
    writeResultAsPNG: false,
    showProgressBar: true,
  },
};

export default settings;

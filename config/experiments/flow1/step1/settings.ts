import { type_SettingsConfig } from "../../../../@types/config";

const settings: type_SettingsConfig = {
  params: {
    timeLength: 5000,
    maxCoeffConst: 0.1,
    maxPopulationSize: 1000000,
    birthRate: 0,
    initialInfectiousRate: 0.001,
    initialFatarity: 0,
    feedbackRate: 0.001, //R -> before Rへの遷移
  },
  models: {
    Space: {
      connectionType: "partial",
      length: {
        col: 1,
        row: 1,
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

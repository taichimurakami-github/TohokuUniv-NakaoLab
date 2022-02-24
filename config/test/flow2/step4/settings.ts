import { type_SettingsConfig } from "../../../../@types/config";

const settings: type_SettingsConfig = {
  params: {
    timeLength: 2500,
    maxCoeffConst: 0,
    maxPopulationSize: 1000000,
    birthRate: 0.0001,
    initialInfectiousRate: 0.0001,
    initialFatarity: 0,
    feedbackRate: 0,
  },
  models: {
    Space: {
      connectionType: "partial",
      length: {
        col: 10,
        row: 10,
      },
    },
    People: {
      initialPopulation: {
        min: 0.01,
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

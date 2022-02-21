import { type_SettingsConfig } from "../@types/config";

const settings: type_SettingsConfig = {
  params: {
    timeLength: 1000,
    maxCoeffConst: 0,
    maxPopulationSize: 1000000,
    birthRate: 0.0001,
    initialInfectiousRate: 0.0001,
    initialFatarity: 0,
    feedbackRate: 0.0007,
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
        min: 1.0,
        max: 1.0,
      },
      EI_transCoeff: 1.0,
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

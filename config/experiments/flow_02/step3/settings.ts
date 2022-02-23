import { SettingsConfig } from "../../../../@types/config";

const settings: SettingsConfig = {
  params: {
    timeLength: 2500,
    maxCoeffConst: 0.1,
    maxPopulationSize: 1000000,
    birthRate: 0.0001,
    initialInfectiousRate: 0.0001,
    initialFatarity: 0,
    feedbackRate: 0,
  },
  models: {
    Space: {
      connectionType: "full",
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

import { type_SettingsConfig } from "../../../../@types/config";

const settings: type_SettingsConfig = {
  params: {
    //パラメータ
    timeLength: 2000,
    maxTravelCoeff: 0.1,
    birthRate: 0,
    initialInfectiousRate: 0.0001,
    initialFatarity: 0,
    feedbackRate: 0.001, //R -> before Rへの遷移

    //初期人口
    initialPopulationMaxSize: 1000000,
    initialPopulationRange: {
      min: 1.0,
      max: 1.0,
    },

    //空間
    spaceConnectionType: "partial",
    spaceLength: {
      col: 1,
      row: 1,
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

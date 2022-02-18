const settings = {
  params: {
    timeLength: 1000,
    maxCoeffConst: 0.1,
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
        col: 5,
        row: 5,
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
    resultArrayDepth: 3,
  },
};

export default settings;

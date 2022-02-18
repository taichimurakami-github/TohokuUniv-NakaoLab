const vaccineConfig = {
  vaccine: {
    begin: {
      10: {
        name: "fizer",
        target: [0],
      },
      210: {
        name: "fizer",
        target: [11],
      },
    },
    data: {
      fizer: {
        duaration: 300,
        effect: {
          alpha: {
            beta: 0.9,
            gamma: 1.1,
            mu: 0.5,
          },
          beta: {
            beta: 0.8,
            gamma: 1.1,
            mu: 0.5,
          },
          gamma: {
            beta: 0,
            gamma: 0.1,
            mu: 0.1,
          },
          delta: {
            beta: 0.1,
            gamma: 0.1,
            mu: 0.1,
          },
          epsilon: {
            beta: 0.1,
            gamma: 0.1,
            mu: 0.1,
          },
          zeta: {
            beta: 0.1,
            gamma: 0.1,
            mu: 0.1,
          },
        },
      },
    },
  },
};

export default vaccineConfig;

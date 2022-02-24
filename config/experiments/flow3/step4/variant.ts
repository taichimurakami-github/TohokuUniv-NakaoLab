import { type_VariantConfig } from "../../../../@types/config";

const variantConfig: { variantConfig: type_VariantConfig } = {
  variantConfig: [
    {
      strainType: "alpha",
      infectivity: 0.2,
      resilience: 0.18,
      fatarity: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        // beta: 0.2,
        // gamma: 0.1,
        // delta: 0.1,
        // epsilon: 0.1,
        // zeta: 0.1,
      },
    },
    {
      strainType: "beta",
      infectivity: 0.3,
      resilience: 0.23,
      fatarity: 0.002,
      appearanceTime: 50,
      appearanceAt: [0],
      crossImmunity: {
        // alpha: 0.1,
        // gamma: 0.2,
        // delta: 0.2,
        // epsilon: 0.15,
        // zeta: 0.15,
      },
    },

    {
      strainType: "gamma",
      infectivity: 0.5,
      resilience: 0.3,
      fatarity: 0.005,
      appearanceTime: 10,
      appearanceAt: [0],
      crossImmunity: {
        // alpha: 0.1,
        // gamma: 0.2,
        // delta: 0.2,
        // epsilon: 0.15,
        // zeta: 0.15,
      },
    },

    //   {
    //     strainType: "delta",
    //     infectivity: 0.5,
    //     resilience: 0.3,
    //     fatarity: 0.001,
    //     appearanceTime: 2000,
    //     appearanceAt: [0],
    //     crossImmunity: {
    //       alpha: 0.2,
    //       gamma: 0.2,
    //       delta: 0.2,
    //       epsilon: 0.2,
    //       zeta: 0.15,
    //     },
    //   },
  ],
};

export default variantConfig;

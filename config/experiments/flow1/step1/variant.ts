import { type_VariantConfig } from "../../../../@types/config";

export const strainTypesArray = ["v_alpha", "v_beta", "v_gamma", "v_delta"];

const variantConfig: { variantConfig: type_VariantConfig } = {
  variantConfig: {
    [strainTypesArray[0]]: {
      strainType: strainTypesArray[0],
      EI_transCoeff: 0.4,
      infectivity: 0.2,
      resilience: 0.18,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 10,
      crossImmunity: {
        // beta: 0.2,
        // gamma: 0.1,
        // delta: 0.1,
        // epsilon: 0.1,
        // zeta: 0.1,
      },
    },
    [strainTypesArray[1]]: {
      strainType: strainTypesArray[1],
      EI_transCoeff: 0.4,
      infectivity: 0.3,
      resilience: 0.23,
      fatality: 0.002,
      appearanceTime: 200,
      appearanceAt: [0, 9],
      crossImmunity: {
        // alpha: 0.1,
        // gamma: 0.2,
        // delta: 0.2,
        // epsilon: 0.15,
        // zeta: 0.15,
      },
    },

    // [strainTypesArray[2]]: {
    //   strainType: strainTypesArray[2],
    //   EI_transCoeff: 0.4,
    //   infectivity: 0.3,
    //   resilience: 0.23,
    //   fatality: 0.002,
    //   appearanceTime: 300,
    //   appearanceAt: [0, 9],
    //   crossImmunity: {
    //     // alpha: 0.1,
    //     // gamma: 0.2,
    //     // delta: 0.2,
    //     // epsilon: 0.15,
    //     // zeta: 0.15,
    //   },
    // },

    //   {
    //     strainType: "gamma",
    //     infectivity: 0.3,
    //     resilience: 0.23,
    //     fatarity: 0.002,
    //     appearanceTime: 500,
    //     appearanceAt: [0],
    //     crossImmunity: {
    //       alpha: 0.1,
    //       gamma: 0.2,
    //       delta: 0.2,
    //       epsilon: 0.15,
    //       zeta: 0.15,
    //     },
    //   },

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
  },
};

export default variantConfig;

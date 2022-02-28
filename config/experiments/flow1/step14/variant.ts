import { type_VariantConfig } from "../../../../@types/config";

export const strainTypesArray = ["v_alpha", "v_beta", "v_gamma", "v_delta"];

const variantConfig: { variantConfig: type_VariantConfig } = {
  variantConfig: {
    [strainTypesArray[0]]: {
      strainType: strainTypesArray[0],
      EI_transCoeff: 0.3,
      infectivity: 0.2,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        [strainTypesArray[0]]: 0.8,
        // [strainTypesArray[1]]: 0.9,
        // [strainTypesArray[2]]: 0.9,
        // [strainTypesArray[3]]: 0.9,
      },
    },
    // [strainTypesArray[1]]: {
    //   strainType: strainTypesArray[1],
    //   EI_transCoeff: 0.5,
    //   infectivity: 0.2,
    //   resilience: 0.3,
    //   fatality: 0.001,
    //   appearanceAt: [0],
    //   appearanceTime: 100,
    //   crossImmunity: {
    //     // [strainTypesArray[0]]: 0.9,
    //     [strainTypesArray[1]]: 0.1,
    //     // [strainTypesArray[2]]: 0.9,
    //     // [strainTypesArray[3]]: 0.9,
    //   },
    // },

    // [strainTypesArray[2]]: {
    //   strainType: strainTypesArray[2],
    //   EI_transCoeff: 0.7,
    //   infectivity: 0.2,
    //   resilience: 0.3,
    //   fatality: 0.001,
    //   appearanceTime: 100,
    //   appearanceAt: [0],
    //   crossImmunity: {
    //     // [strainTypesArray[0]]: 0.9,
    //     // [strainTypesArray[1]]: 0.9,
    //     [strainTypesArray[2]]: 0.1,
    //     // [strainTypesArray[3]]: 0.9,
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

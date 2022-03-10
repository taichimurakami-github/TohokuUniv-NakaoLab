import { type_VariantConfig } from "../../../../@types/config";

export const strainTypesArray = [
  "v_alpha",
  "v_beta",
  "v_gamma",
  "v_delta",
  "v_mu",
  "v_epsilon",
];

const variantConfig: { variantConfig: type_VariantConfig } = {
  variantConfig: {
    [strainTypesArray[0]]: {
      strainType: strainTypesArray[0],
      EI_transCoeff: 0.5,
      infectivity: 0.3,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        [strainTypesArray[0]]: {
          beta: 0.5,
          mu: 0.3,
          gamma: 1.1,
        },
      },
    },

    [strainTypesArray[1]]: {
      strainType: strainTypesArray[1],
      EI_transCoeff: 0.5,
      infectivity: 0.4,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        [strainTypesArray[1]]: {
          beta: 0.5,
          mu: 0.3,
          gamma: 1.1,
        },
      },
    },

    [strainTypesArray[2]]: {
      strainType: strainTypesArray[2],
      EI_transCoeff: 0.5,
      infectivity: 0.5,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        [strainTypesArray[2]]: {
          beta: 0.5,
          mu: 0.3,
          gamma: 1.1,
        },
      },
    },

    [strainTypesArray[3]]: {
      strainType: strainTypesArray[3],
      EI_transCoeff: 0.5,
      infectivity: 0.6,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        [strainTypesArray[3]]: {
          beta: 0.5,
          mu: 0.3,
          gamma: 1.1,
        },
      },
    },

    [strainTypesArray[4]]: {
      strainType: strainTypesArray[4],
      EI_transCoeff: 0.5,
      infectivity: 0.7,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        [strainTypesArray[4]]: {
          beta: 0.5,
          mu: 0.3,
          gamma: 1.1,
        },
      },
    },

    [strainTypesArray[5]]: {
      strainType: strainTypesArray[5],
      EI_transCoeff: 0.5,
      infectivity: 0.8,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 100,
      crossImmunity: {
        [strainTypesArray[5]]: {
          beta: 0.5,
          mu: 0.3,
          gamma: 1.1,
        },
      },
    },
  },
};

export default variantConfig;

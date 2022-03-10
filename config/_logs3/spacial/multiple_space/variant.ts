import { type_VariantConfig } from "../../../../@types/config";

export const strainTypesArray = [
  "v_alpha",
  "v_beta",
  "v_gamma",
  "v_delta",
  "v_mu",
  "v_epsilon",
];

const defaultImmunity = {
  beta: 0.8,
  mu: 0.8,
  gamma: 1.01,
};

const variantConfig: { variantConfig: type_VariantConfig } = {
  variantConfig: {
    [strainTypesArray[0]]: {
      strainType: strainTypesArray[0],
      EI_transCoeff: 0.5,
      infectivity: 0.35,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 10,
      crossImmunity: {
        [strainTypesArray[1]]: defaultImmunity,
        [strainTypesArray[2]]: defaultImmunity,
        [strainTypesArray[0]]: {
          beta: 0.5,
          gamma: 1.1,
          mu: 0.3,
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
        [strainTypesArray[0]]: defaultImmunity,
        [strainTypesArray[2]]: defaultImmunity,
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
        [strainTypesArray[0]]: defaultImmunity,
        [strainTypesArray[1]]: defaultImmunity,
        [strainTypesArray[2]]: {
          beta: 0.5,
          mu: 0.3,
          gamma: 1.1,
        },
      },
    },
  },
};

export default variantConfig;

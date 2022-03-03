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
      infectivity: 0.2,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 10,
      crossImmunity: {
        [strainTypesArray[0]]: 0.2,
      },
    },
    [strainTypesArray[1]]: {
      strainType: strainTypesArray[1],
      EI_transCoeff: 0.5,
      infectivity: 0.3,
      resilience: 0.3,
      fatality: 0.001,
      appearanceAt: [0],
      appearanceTime: 200,
      crossImmunity: {
        [strainTypesArray[1]]: 0.3,
      },
    },

    [strainTypesArray[2]]: {
      strainType: strainTypesArray[2],
      EI_transCoeff: 0.5,
      infectivity: 0.4,
      resilience: 0.3,
      fatality: 0.001,
      appearanceTime: 300,
      appearanceAt: [0],
      crossImmunity: {
        [strainTypesArray[2]]: 0.3,
      },
    },

    [strainTypesArray[3]]: {
      strainType: strainTypesArray[2],
      EI_transCoeff: 0.5,
      infectivity: 0.4,
      resilience: 0.3,
      fatality: 0.03,
      appearanceTime: 500,
      appearanceAt: [0],
      crossImmunity: {
        [strainTypesArray[3]]: 0.5,
      },
    },

    [strainTypesArray[4]]: {
      strainType: strainTypesArray[2],
      EI_transCoeff: 0.5,
      infectivity: 0.55,
      resilience: 0.3,
      fatality: 0.001,
      appearanceTime: 700,
      appearanceAt: [0],
      crossImmunity: {
        [strainTypesArray[4]]: 0.4,
      },
    },

    [strainTypesArray[5]]: {
      strainType: strainTypesArray[5],
      EI_transCoeff: 0.5,
      infectivity: 0.35,
      resilience: 0.3,
      fatality: 0.01,
      appearanceTime: 1000,
      appearanceAt: [0],
      crossImmunity: {
        [strainTypesArray[5]]: 0.3,
      },
    },
  },
};

export default variantConfig;

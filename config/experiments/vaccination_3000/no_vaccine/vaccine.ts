import { type_VaccineConfig } from "../../../../@types/config";
import { strainTypesArray } from "./variant";

const vaccineConfig: { vaccine: type_VaccineConfig } = {
  vaccine: {
    begin: {},
    data: {
      vax_01: {
        duration: 300,
        effect: {
          [strainTypesArray[0]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
          [strainTypesArray[1]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
          [strainTypesArray[2]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
        },
      },
    },
  },
};

export default vaccineConfig;

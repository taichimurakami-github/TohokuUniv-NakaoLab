import { type_VaccineConfig } from "../../../../@types/config";
import { strainTypesArray } from "./variant";

const vaccineConfig: { vaccine: type_VaccineConfig } = {
  vaccine: {
    begin: {
      // 100: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 200: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 300: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 400: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 500: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 600: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 700: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 800: {
      //   name: "fizer",
      //   target: [0],
      // },
      // 900: {
      //   name: "fizer",
      //   target: [0],
      // },
    },
    data: {
      fizer: {
        duration: 300,
        effect: {
          [strainTypesArray[0]]: {
            beta: 0.95,
            gamma: 1.1,
            mu: 0.5,
          },
          [strainTypesArray[1]]: {
            beta: 0.95,
            gamma: 1.1,
            mu: 0.5,
          },
          [strainTypesArray[2]]: {
            beta: 0.9,
            gamma: 1.1,
            mu: 0.1,
          },
        },
      },
    },
  },
};

export default vaccineConfig;

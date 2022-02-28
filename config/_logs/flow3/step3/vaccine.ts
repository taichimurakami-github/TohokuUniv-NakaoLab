import { type_VaccineConfig } from "../../../../@types/config";
import { strainTypesArray } from "./variant";

const targetArray = [];
let i = 0;
while (i < 99) {
  i % 10 === 0 && targetArray.push(i);
  i++;
}

const vaccineConfig: { vaccine: type_VaccineConfig } = {
  vaccine: {
    begin: {
      100: {
        name: "fizer",
        target: targetArray,
      },
      200: {
        name: "fizer",
        target: targetArray,
      },
      300: {
        name: "fizer",
        target: targetArray,
      },
      400: {
        name: "fizer",
        target: targetArray,
      },
      500: {
        name: "fizer",
        target: targetArray,
      },
      600: {
        name: "fizer",
        target: targetArray,
      },
      700: {
        name: "fizer",
        target: targetArray,
      },
      800: {
        name: "fizer",
        target: targetArray,
      },
      900: {
        name: "fizer",
        target: targetArray,
      },
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

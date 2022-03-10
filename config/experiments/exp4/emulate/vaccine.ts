import { type_VaccineConfig } from "../../../../@types/config";
import settings from "./settings";
import { strainTypesArray } from "./variant";

const vaccineConfig: { vaccine: type_VaccineConfig } = {
  vaccine: {
    begin: {},
    data: {
      vax_01: {
        duration: 400,
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
          [strainTypesArray[3]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
          [strainTypesArray[4]]: {
            beta: 0.8,
            gamma: 1.02,
            mu: 0.5,
          },
        },
      },
    },
  },
};

const SPACE_SIZE =
  settings.params.spaceLength.row * settings.params.spaceLength.col;
const spaceArray = [];
let i = 0;
while (i < SPACE_SIZE) {
  spaceArray.push(i++);
}

vaccineConfig.vaccine.begin[500] = { name: "vax_01", target: spaceArray };

export default vaccineConfig;

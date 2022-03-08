import { type_VaccineConfig } from "../../../../@types/config";
import settings from "./settings";
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

const SPACE_SIZE =
  settings.params.spaceLength.row * settings.params.spaceLength.col;
const spaceArray = [];
let i = 0;
while (i < SPACE_SIZE) {
  spaceArray.push(i++);
}

let t = 1;
const MAX_TIME = settings.params.timeLength;

while (t < MAX_TIME) {
  if (t % 200 === 0)
    vaccineConfig.vaccine.begin[t] = { name: "vax_01", target: spaceArray };
  t++;
}

export default vaccineConfig;

// const { getRandomFloat } = require("./calc/lib");
// const { generateCoeffMatrix } = require("./calc/coeff");
// const { generateNewPeopleDist } = require("./calc/main");
// const path = require("path");
// const { readFile, writeFile, showProgressOnConsole, showResultOnConsole, showConfigOnConsole } = require("./io/io");
const { generateNewEquationState } = require("./calc/main");
const { initialEqState } = require("./state");
const { initialEqConst } = require("./const");




(async () => {

  const state = [{ ...initialEqState }];
  const eqConst = { ...initialEqConst };
  console.log("calc start");
  console.log(state[0]);

  for (let t = 0; t < 100; t++) {
    const thisTimeConst = t > 50 ? {
      ...eqConst,
      gamma_M: 0.4,
      EPSILON_M: 100,
    }
      :
      { ...eqConst };

    state.push({ ...generateNewEquationState(state[t], thisTimeConst) });
  }

  console.log(state[state.length - 1]);

})();
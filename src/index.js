const { getRandomFloat } = require("./calc/lib");
const { generateCoeffMatrix } = require("./calc/coeff");
const { generateNewPeopleDist, simulateInfection } = require("./calc/main");
const path = require("path");
const {
  readFile,
  writeFile,
  showProgressOnConsole,
  showResultOnConsole,
  showConfigOnConsole,
} = require("./io/io");

(async () => {
  /**
   * 設定読み込み & 表示
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));
  showConfigOnConsole(config);

  /**
   * 実行用関数
   * @param {array} space
   * @returns {array} (AOA)
   */
  const execute = (space) => {
    const spaceLog = [space.map((val) => val)];
    const timeLength = config.params.timeLength;
    const max_coeff_const = config.params.max_coeff_const;
    // const diffLogArr = [[{ S: 0, I: 0, R: 0 }]];
    const initialEqConst = { ...config.eqConst };

    for (let t = 1; t < timeLength; t++) {
      const coeffMatrix = generateCoeffMatrix(space, max_coeff_const);
      const newPeopleDistSpace = generateNewPeopleDist(
        spaceLog[t - 1],
        coeffMatrix,
        config.eqSettings
      );
      const infectionSimulatedResult = simulateInfection(
        newPeopleDistSpace,
        initialEqConst,
        t
      );

      spaceLog.push(infectionSimulatedResult);
      // diffLogArr.push(diffLogArrFromSimulate);

      config.io.showProgressBar && showProgressOnConsole(t, timeLength);
    }

    return spaceLog;
    // return [spaceLog, diffLogArr];
  };

  /**
   * 計算準備
   */
  const space = [];
  const spaceLength = config.params.spaceLength;
  const populationConst = config.params.populationConst;

  for (let i = 0; i < spaceLength; i++) {
    const amount = Math.round(populationConst * getRandomFloat(0.001, 1));
    space.push({
      S: amount,
      I: 100,
      R: 0,
    });
  }

  /**
   * 実行
   */
  // const [calcResult, diffLogArr] = execute(space);
  const calcResult = execute(space);
  // console.log(calcResult);
  // console.log(diffLogArr);

  /**
   * 結果の確認 (整形してconsole出力)
   */
  // showResultOnConsole(calcResult);

  /**
   * xlsxファイル出力
   */
  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");

    const parsedCalcResult = [[]];

    for (let i = 0; i < calcResult[0].length; i++) {
      parsedCalcResult[0] = [
        ...parsedCalcResult[0],
        `S_${i}`,
        `I_${i}`,
        `R_${i}`,
      ];
    }

    for (const dataOfThisTime of calcResult) {
      const pushValue = [];
      for (const val of dataOfThisTime) {
        pushValue.push(val.S);
        pushValue.push(val.I);
        pushValue.push(val.R);
      }
      parsedCalcResult.push(pushValue);
    }

    // for (let i = 0; i < calcResult.length; i++) {
    //   const pushValue = [
    //     calcResult[i][0].S,
    //     calcResult[i][0].I,
    //     calcResult[i][0].R,
    //   ];
    //   parsedCalcResult.push(pushValue);
    // }

    const writeResult = await writeFile(parsedCalcResult);

    writeResult && console.log("...done!\n\n\n");
  }
})();

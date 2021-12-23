const { getRandomFloat } = require("./calc/lib");
const { generateCoeffMatrix } = require("./calc/coeff");
const { generateNewPeopleDist, simulateInfection } = require("./calc/main");
const path = require("path");
const { readFile, writeFile, showProgressOnConsole, showResultOnConsole, showConfigOnConsole } = require("./io/io");
const { exit } = require("process");


(async () => {


  /**
   * 実行用関数
   * @param {array} space 
   * @returns {array} (AOA)
   */
  const execute = (space) => {
    const spaceLog = [space.map(val => val)];
    const timeLength = config.params.timeLength;
    const max_coeff_const = config.params.max_coeff_const;
    const diffLogArr = [[{ S: 0, I: 0, R: 0 }]];

    // console.log(spaceLog);
    // console.log(spaceLog[0]);
    const initialEqConst = {
      beta: 0.05,
      gamma: 0.8,
      sigma: 0,
      mu_S: 0,
      mu_I: 0,
      mu_R: 0,
    }

    for (let t = 1; t < timeLength; t++) {

      const coeffMatrix = generateCoeffMatrix(space, max_coeff_const);
      const newPeopleDistSpace = generateNewPeopleDist(spaceLog[t - 1], coeffMatrix);
      const [infectionSimulatedResult, diffLogArrFromSimulate] = simulateInfection(newPeopleDistSpace, initialEqConst);
      spaceLog.push(infectionSimulatedResult);
      diffLogArr.push(diffLogArrFromSimulate);



      config.io.showProgressBar && showProgressOnConsole(t, timeLength);
    }


    return [spaceLog, diffLogArr];
  }

  /**
   * 設定読み込み & 表示
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));
  showConfigOnConsole(config);

  /**
   * 計算準備
   */
  const space = [];
  const spaceLength = config.params.spaceLength;
  const populationConst = config.params.populationConst;

  for (let i = 0; i < spaceLength; i++) {
    const amount = Math.round(populationConst * getRandomFloat(0.001, 1));
    space.push({
      S: 0,
      I: amount,
      R: 0
    });
  }

  /**
   * 実行
   */
  const [calcResult, diffLogArr] = execute(space);
  console.log(calcResult);
  console.log(diffLogArr);

  /**
   * 結果の確認 (整形してconsole出力)
   */
  // showResultOnConsole(calcResult);

  /**
   * xlsxファイル出力
   */
  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");

    const parsedCalcResult = [["S_0", "I_0", "R_0", "diff_S0", "diff_I0", "diff_R0"]];

    for (let i = 0; i < calcResult.length; i++) {
      const pushValue = [
        calcResult[i][0].S, calcResult[i][0].I, calcResult[i][0].R,
        diffLogArr[i][0].S, diffLogArr[i][0].I, diffLogArr[i][0].R
      ]
      i < 10 && console.log(pushValue);
      parsedCalcResult.push(pushValue);
    }


    const writeResult = await writeFile(parsedCalcResult);

    writeResult && console.log("...done!\n\n\n");
  }

})();
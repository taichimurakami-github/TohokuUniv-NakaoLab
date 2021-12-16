const { getRandomFloat, getIntArrayAmount, getMaxAndMinFromIntArray } = require("./calc/lib");
const { generateCoeffMatrix } = require("./calc/coeff");
const { generateNewPeopleDist } = require("./calc/main");
const path = require("path");
const { readFile, writeFile, showProgressOnConsole } = require("./io/io");


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

    for (let t = 1; t < timeLength; t++) {
      const coeffMatrix = generateCoeffMatrix(space, max_coeff_const);
      spaceLog.push(generateNewPeopleDist(spaceLog[t - 1], coeffMatrix));
      config.io.showProgressBar && showProgressOnConsole(t, timeLength);
    }

    return spaceLog;
  }

  /**
   * 設定読み込み & 表示
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));
  console.log(`
    read simulation settings is below:

    params settings:
    ${config.params}

    io mode: 
      show progress bar : ${config.io.showCalcProgressBar ? "yes" : "no"}
      write result file : ${config.io.writeResultAsXLSX ? "yes" : "no"}
    
  `);


  /**
   * 計算準備
   */
  const space = [];
  const spaceLength = config.params.spaceLength;
  const peopleConst = config.params.peopleConst;

  for (let i = 0; i < spaceLength; i++) {
    const amount = Math.round(peopleConst * getRandomFloat(0.001, 1));
    space.push(amount);
  }


  /**
   * 実行
   */
  const calcResult = execute(space);


  /**
   * 結果の確認 (整形してconsole出力)
   */
  const beforeMinMax = getMaxAndMinFromIntArray(calcResult[0]);
  const afterMinMax = getMaxAndMinFromIntArray(calcResult[calcResult.length - 1]);

  console.log(`
    -------------------------RESULT-------------------------

    ~~~~~~ before calculation ~~~~~~
    total population: ${getIntArrayAmount(calcResult[0])}
    (min, max) = (${beforeMinMax.min}, ${beforeMinMax.max})
  `);
  console.log(calcResult[0]);
  console.log("\n")

  console.log(`
    ~~~~~~ after  calculation ~~~~~~
    total population : ${getIntArrayAmount(calcResult[calcResult.length - 1])}
    (min, max) = (${afterMinMax.min}, ${afterMinMax.max})
  `)
  console.log(calcResult[calcResult.length - 1]);
  console.log("\n\ncalculation finished!\n")


  /**
   * xlsxファイル出力
   */

  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");
    const writeResult = await writeFile(calcResult);

    writeResult && console.log("...done!\n\n\n");
  }

})();
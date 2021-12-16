const { getRandomFloat } = require("./calc/lib");
const { generateCoeffMatrix } = require("./calc/coeff");
const { generateNewPeopleDist } = require("./calc/main");
const path = require("path");
const { readFile, writeFile, showProgressOnConsole, showResultOnConsole, showConfigOnConsole } = require("./io/io");


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
  showConfigOnConsole(config);

  /**
   * 計算準備
   */
  const space = [];
  const spaceLength = config.params.spaceLength;
  const populationConst = config.params.populationConst;

  for (let i = 0; i < spaceLength; i++) {
    const amount = Math.round(populationConst * getRandomFloat(0.001, 1));
    space.push(amount);
  }


  /**
   * 実行
   */
  const calcResult = execute(space);

  /**
   * 結果の確認 (整形してconsole出力)
   */
  showResultOnConsole(calcResult);

  /**
   * xlsxファイル出力
   */
  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");
    const writeResult = await writeFile(calcResult);

    writeResult && console.log("...done!\n\n\n");
  }

})();
const { getRandomFloat, getNumArrayAmount, getNumArrayAverage } = require("./calc/lib");
const { generateCoeffMatrix } = require("./calc/coeff");
const { generateNewPeopleDist } = require("./calc/main");
const path = require("path");
const { readFile, writeFile } = require("./io/io");

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
    }

    return spaceLog;
  }

  /**
   * 設定読み込み
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));

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

  const getIntArrayAmount = (arr) => {
    let sum = 0;
    for (const val of arr) sum += val;
    return sum;
  }

  const getMaxAndMinFromIntArray = (arr) => {
    let max = 0;
    for (const val of arr) {
      if (val > max) max = val;
    }

    let min = max;

    for (const val of arr) {
      if (val < min) min = val;
    }

    return { min: min, max: max };
  }


  /**
   * 実行
   */
  const calcResult = execute(space);


  /**
   * 結果の確認
   */
  const beforeMinMax = getMaxAndMinFromIntArray(calcResult[0]);
  const afterMinMax = getMaxAndMinFromIntArray(calcResult[calcResult.length - 1]);

  console.log("------------------before calculation------------------");
  console.log(`total population: ${getIntArrayAmount(calcResult[0])}`);
  console.log(`(min, max) = (${beforeMinMax.min}, ${beforeMinMax.max})`);
  console.log(calcResult[0]);

  console.log("------------------after  calculation------------------");
  console.log(`total population : ${getIntArrayAmount(calcResult[calcResult.length - 1])}`);
  console.log(`(min, max) = (${afterMinMax.min}, ${afterMinMax.max})`);
  console.log(calcResult[calcResult.length - 1]);

  // console.log(calcResult[100]);

  /**
   * xlsxファイル出力
   */
  // const writeFileOptions = {
  //   dataType: "MATRIX",
  //   writeFileType: "XLSX",
  //   writeMode: "async"
  // };

  if (config.io.writeResultAsXLSX) {
    console.log("writing result as xlsx file...");
    const writeResult = await writeFile(calcResult);

    writeResult && console.log("...done!");
  }

})();
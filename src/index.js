const { getRandomFloat, getNumArrayAmount, getNumArrayAverage } = require("./calc/lib");
const { generateCoeffMatrix } = require("./calc/coeff");
const { generateNewPeopleDist } = require("./calc/main");
const { readFile, writeFile } = require("./io/io");

// const config = readFile()

const execute = (space) => {
  const spaceLog = [space.map(val => val)];
  const timeLength = 100;

  for (let t = 1; t < timeLength; t++) {
    const coeffMatrix = generateCoeffMatrix(space);
    spaceLog.push(generateNewPeopleDist(spaceLog[t - 1], coeffMatrix));
  }

  return spaceLog;
}


(async () => {

  /**
   * 計算準備
   */
  const space = [];
  const spaceLength = 2000;
  const peopleConst = 1000000;

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
  console.log(`total population (before calc): ${getIntArrayAmount(calcResult[0])}`);
  const beforeMinMax = getMaxAndMinFromIntArray(calcResult[0]);
  console.log(`(min, max) = (${beforeMinMax.min}, ${beforeMinMax.max})`);
  console.log(calcResult[0]);
  console.log(`total population (after calc) : ${getIntArrayAmount(calcResult[calcResult.length - 1])}`);
  const afterMinMax = getMaxAndMinFromIntArray(calcResult[calcResult.length - 1]);
  console.log(`(min, max) = (${afterMinMax.min}, ${afterMinMax.max})`);
  console.log(calcResult[calcResult.length - 1]);

  // console.log(calcResult[100]);

  /**
   * xlsxファイル出力
   */
  const writeFileOptions = {
    dataType: "MATRIX",
    writeFileType: "XLSX",
    writeMode: "async"
  };

  // await writeFile(calcResult, writeFileOptions);

})();
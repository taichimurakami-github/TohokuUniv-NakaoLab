//module import
const readline = require("readline");

//lib import
const { getIntArrayAmount, getMaxAndMinFromIntArray } = require("../calc/lib");

/**
 * 計算の進捗バーをコンソールに表示する
 * @param {int} now
 * @param {int} total
 */
const showProgressOnConsole = (now, total) => {
  /**
   * erace cursor
   */
  process.stdout.write("\x1B[?25l");

  /**
   * calc now percentage
   * (if now === total - 1 then 100%)
   */
  const nowPercentage =
    now === total - 1 ? 100 : Math.floor((now / total) * 100);

  /**
   * creating bar
   */
  let bar = "";
  const barDetail = 2;
  const barMaxLength = 100 / barDetail;
  const nowBarLength = Math.floor(nowPercentage / barDetail);

  for (let i = 0; i < barMaxLength; i++) {
    bar += i <= nowBarLength ? "#" : "_";
  }

  /**
   * move cursor and rewrite progress
   */
  if (now !== 0) readline.moveCursor(process.stdout, 0, -3);

  process.stdout.write(`
    now calculating ...
    progress: ${bar} ${nowPercentage}%
  `);

  /**
   * show cursor
   */
  if (now === total - 1) {
    process.stdout.write("\x1B[?25h");
    console.log("\n\n");
  }
};

/**
 * 計算前に設定をコンソールに出力
 * @param {object} config
 */
const showConfigOnConsole = (config) => {
  console.log(`
    read simulation settings is below:

    - params settings
      space length      : ${config.params.spaceLength}
      time length       : ${config.params.timeLength}
      max_coeff_const   : ${config.params.max_coeff_const}
      population const  : ${config.params.populationConst}

    - io settings
      show progress bar : ${config.io.showProgressBar ? "yes" : "no"}
      write result file : ${config.io.writeResultAsXLSX ? "yes" : "no"}
    
  `);
};

/**
 * 計算結果を整形してコンソールに出力
 * @param {array of array} calcResult
 */
const showResultOnConsole = (calcResult) => {
  const beforeMinMax = getMaxAndMinFromIntArray(calcResult[0]);
  const afterMinMax = getMaxAndMinFromIntArray(
    calcResult[calcResult.length - 1]
  );

  console.log(`
    -------------------------RESULT-------------------------


    ~~~~~~~~~~~~~~~  before calculation  ~~~~~~~~~~~~~~~~~~~

        total population: ${getIntArrayAmount(calcResult[0])}
        (min, max) = (${beforeMinMax.min}, ${beforeMinMax.max})
  `);
  console.log(calcResult[0]);

  console.log(`


  
    ~~~~~~~~~~~~~~~~~  after  calculation  ~~~~~~~~~~~~~~~~~~

        total population : ${getIntArrayAmount(
          calcResult[calcResult.length - 1]
        )}
        (min, max) = (${afterMinMax.min}, ${afterMinMax.max})
  `);
  console.log(calcResult[calcResult.length - 1]);
  console.log("\n\ncalculation finished!\n");
};

module.exports = {
  showProgressOnConsole,
  showResultOnConsole,
  showConfigOnConsole,
};

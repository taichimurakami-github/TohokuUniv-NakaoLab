const path = require("path");
const { readFile, writeFile } = require("./io/io");
const { generateNewEquationState } = require("./calc/main");
const { Space } = require("./Models/Space/Space");

(async () => {
  /**
   * 設定読み込み
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));

  /**
   * 計算準備
   */
  const s = new Space(config);

  /**
   * 計算 >> Spaceインスタンスを主軸に計算を行う
   */
  for (let t = 0; t < config.params.timeLength; t++) {
    s.updateWithCycleStart();

    //計算を実行し、Space.PeopleStatesを変化させる
    generateNewEquationState(s);

    s.updateWithCycleEnd();
  }

  const results = s.getResults();

  console.log("\n\ncalc before:");
  console.log(results[0]);
  console.log("\n calc result:");
  console.log(results[results.length - 1]);
  console.log("\n");

  /**
   * xlsxファイル出力
   */
  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");

    const parsedResult = [
      [...p.struct.S, ...p.struct.I, ...p.struct.R, "SUM_I_EX", "SUM_I_MX"],
      ...p.result.ArrayOfPop,
    ];

    const writeResult = await writeFile(parsedResult);

    writeResult && console.log("...done!\n\n\n");
  }
})();

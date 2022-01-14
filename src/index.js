const path = require("path");
const { readFile, writeFile } = require("./io/io");
const { generateNewEquationState } = require("./calc/main");
const { People } = require("./Models/People/People");
const { Society } = require("./Models/Society/Society");

(async () => {
  /**
   * 設定読み込み
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));

  /**
   * 計算準備
   */
  const p = new People(config);
  const s = new Society(p, config);

  /**
   * 計算
   */
  for (let t = 0; t < config.params.timeLength; t++) {
    //1. 時間を設定
    //2. 各フェーズ特有のイベントを実行、人口分布の変化も行う
    p.updateWithCycleStart();

    //計算を実行し、PeopleStatesを変化させる
    generateNewEquationState(p);

    //1. 計算結果である差分を適用
    //2. 差分適用後の状態を記録
    p.updateWithCycleEnd();
  }

  console.log("\n\ncalc before:");
  console.log(p.result.ArrayOfObj[0]);
  console.log("\n calc result:");
  console.log(p.result.ArrayOfObj[p.result.ArrayOfObj.length - 1]);
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

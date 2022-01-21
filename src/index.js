const path = require("path");
const { readFile, writeFile } = require("./io/io");
const { Space } = require("./Models/Space/Space");

(async () => {
  /**
   * (1)設定読み込み
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));

  /**
   * (2)計算準備
   */
  const s = new Space(config);

  /**
   * (3)計算
   */
  for (let t = 0; t < config.params.timeLength; t++) {
    s.updateWithLifeCycle();
  }

  /**
   * (4)結果取得
   */
  const result = s.getResults();

  /**
   * (5)書き出し
   */
  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");

    const resultAsObjectTemplate = Object.values(result[0].asObject);
    const resultAxis = Object.keys(resultAsObjectTemplate[0]);
    const parsedResult = result.map((PeopleResult) => PeopleResult.asArray);

    await writeFile(parsedResult, resultAxis);
  }
})();

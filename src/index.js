const path = require("path");
const { IO } = require("./io/io");
const { Space } = require("./Models/Space/Space");

(async () => {
  /**
   * (1)設定読み込み
   */
  const config = await IO.readFile(path.resolve(__dirname, "../config.json"));

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
  const writeFileTypes = [];
  config.io.writeResultAsXLSX && writeFileTypes.push("xlsx");
  config.io.writeResultAsPNG && writeFileTypes.push("png");

  //ファイル書き出し
  if (writeFileTypes.length > 0) {
    console.log("\nwriting result...\n");

    await IO.writeFile(writeFileTypes, result);

    console.log("\n....done!");
  }
})();

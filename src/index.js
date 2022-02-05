const path = require("path");
const { IO } = require("./io/io");
const { Space } = require("./Models/Space/Space");

(async () => {
  /**
   * (1)設定読み込み
   */
  const settings = await IO.readFile(
    path.resolve(__dirname, "../config/settings.json")
  );
  const vaccinationConfig = await IO.readFile(
    path.resolve(__dirname, "../config/settings.json")
  );
  const variantConfig = await IO.readFile(
    path.resolve(__dirname, "../config/variant.json")
  );
  const config = { ...settings, ...vaccinationConfig, ...variantConfig };

  /**
   * (2)計算準備
   */
  const s = new Space(config);

  /**
   * (3)計算
   */
  const timeLength = config.params.timeLength;
  for (let t = 0; t < timeLength; t++) {
    config.io.showProgressBar &&
      IO.showProgressOnConsole(t, config.params.timeLength);
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
  config.io.writeResultAsJSON && writeFileTypes.push("json");
  config.io.writeResultAsPNG && writeFileTypes.push("png");

  //ファイル書き出し
  if (writeFileTypes.length > 0) {
    console.log("\nwriting result...\n");

    await IO.writeFile(writeFileTypes, result, config);

    console.log("\n....done!");
  }
})();

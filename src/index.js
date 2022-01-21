const path = require("path");
const { readFile, writeFile } = require("./io/io");
const { Space } = require("./Models/Space/Space");

(async () => {
  /**
   * 設定読み込み
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));

  const s = new Space(config);

  for (let t = 0; t < config.params.timeLength; t++) {
    s.updateWithCycleStart();
    s.executeTransition();
    s.updateWithCycleEnd();
  }

  const result = s.getResults();

  console.log("\n");
  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");

    const resultAsObjectTemplate = Object.values(result[0].asObject);
    const resultAxis = Object.keys(resultAsObjectTemplate[0]);
    const parsedResult = result.map((PeopleResult) => PeopleResult.asArray);

    await writeFile(parsedResult, resultAxis);
  }
})();

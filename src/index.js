const path = require("path");
const { People } = require("./Models/People/People");
const { Virus } = require("./Models/Virus/Virus");
const { readFile, writeFile } = require("./io/io");
const { Transition } = require("./Models/Calculation/Transition");

(async () => {
  /**
   * 設定読み込み
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));

  const v = new Virus(config.variantConfig);
  const p = new People(config, v);
  // console.log("\n");
  // console.log(p.state);
  // console.log("\nstate:\n");
  // console.log(p.state[3][0].I);

  for (let t = 0; t < config.params.timeLength; t++) {
    p.updateWithCycleStart(v);
    new Transition(p);
    p.updateWithCycleEnd();
  }

  console.log(p.result);
  console.log("\n");
  console.log(p.state[3][0].I);
})();

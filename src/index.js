const path = require("path");
const { calcCombination } = require("./Models/Calculation/Calculation");
// const { readFile, writeFile } = require("./io/io");

(async () => {
  // function generateCombination(e) {
  //   let S = [];
  //   for (i = 0; e > i; i++) {
  //     S.push(0);
  //   }
  //   select(0, e, S);
  // }

  // function select(i, e, S) {
  //   if (i === e) {
  //     console.log(S);
  //     return;
  //   }

  //   select(i + 1, e, S);
  //   S[i] = 1;
  //   select(i + 1, e, S);
  //   S[i] = 0; //Sは参照先が同じなので、1を代入してそのままだと1が代入された配列を用いて残りの再帰が計算されてしまう。よって、一度デフォルトの0から値を変えたらリセット
  // }

  // generateCombination(3);

  console.log(
    calcCombination(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"], 2)
  );

  return;

  /**
   * 設定読み込み
   */
  // const config = await readFile(path.resolve(__dirname, "../config.json"));
})();

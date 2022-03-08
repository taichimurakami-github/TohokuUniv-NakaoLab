import { IO } from "./io/io";
import { Space } from "./Models/Space/Space";
import { type_AllConfig } from "../@types/config";
import { Config } from "./Models/Config/Config";

export const main = async (
  config: type_AllConfig,
  flowName: string,
  stepName: string
) => {
  //計算準備
  config.io.writeResultAsXLSX = true;
  const c = new Config(config);
  const s = new Space(c);

  //計算
  const timeLength = config.params.timeLength;
  for (let t = 0; t < timeLength; t++) {
    config.io.showProgressBar &&
      IO.showProgressOnConsole(t, config.params.timeLength);
    s.updateWithLifeCycle();
  }

  //結果取得
  const result = s.getResults();

  // 書き出し
  const writeFileTypes = [];
  config.io.writeResultAsXLSX && writeFileTypes.push("xlsx");
  config.io.writeResultAsJSON && writeFileTypes.push("json");
  config.io.writeResultAsPNG && writeFileTypes.push("png");

  //ファイル書き出し
  if (writeFileTypes.length > 0) {
    console.log("\nwriting result...");

    await IO.writeFile(writeFileTypes, result, flowName, stepName);

    console.log("\n....done!\n\n\n");
  }

  return;
};

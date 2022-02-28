const path = require("path");
const fs = require("fs/promises");
const { main } = require("./main");

/**
 * 実験を自動化
 */
const execute = async () => {
  const configRootDirPath = path.resolve(
    __dirname,
    "../",
    "./config/experiments/"
  );
  const expFlowDirNames = await fs.readdir(configRootDirPath);
  for (const expFlowDirName of expFlowDirNames) {
    const expStepDirNames = await fs.readdir(
      path.resolve(configRootDirPath, expFlowDirName)
    );

    for (const expStepDirName of expStepDirNames) {
      const configFilePath = path.resolve(
        configRootDirPath,
        `${expFlowDirName}/${expStepDirName}/`
      );
      const settingsConfigReadData = await import(
        configFilePath + "/settings.ts"
      );
      const variantConfigReadData = await import(
        configFilePath + "/variant.ts"
      );
      const vaccineConfigReadData = await import(
        configFilePath + "/vaccine.ts"
      );

      const settings = settingsConfigReadData.default;
      const variant = variantConfigReadData.default;
      const vaccine = vaccineConfigReadData.default;
      const configData = {
        ...settings,
        ...variant,
        ...vaccine,
      };

      //取得したconfigデータに基づいて計算実行
      await main(configData, expFlowDirName, expStepDirName);
    }
  }
};

execute();

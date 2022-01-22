//module import
const fs = require("fs").promises;

/**
 * 渡されたファイルパスに該当するファイルを読み込む
 * とりあえずjsonしか使わない
 *
 * @param {string} filePath
 * @returns
 */
const readFile = async (filePath) => {
  console.log(`\nreading files: ${filePath}`);
  const fileType = filePath.split(".").pop();

  switch (fileType) {
    case "json":
      console.log("reading json file...\n");
      return JSON.parse(await fs.readFile(filePath, "utf-8"));

    default:
      return await fs.readFile(filePath, "utf-8");
  }
};

module.exports = { readFile };

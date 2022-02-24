//module import
const fs = require("fs").promises;
const path = require("path");
const XLSX = require("xlsx");

/**
 * 計算結果をXLSX形式で書き出し
 * @param {array of array} data
 * @returns
 */
const writeFile = async (writeFiletypes, result, flowName, stepName) => {
  const now = new Date();
  const dateString = `${now.getFullYear()}.${
    now.getMonth() + 1
  }.${now.getDate()}`;

  //ファイル生成
  for (const fileType of writeFiletypes) {
    const writeFileRootDir = path.resolve(
      __dirname,
      "../../result/" + fileType + "/" + dateString
    );
    //書き出しフォルダを生成
    await handleMakeDir(writeFileRootDir);

    //ファイル拡張子ごとに処理
    switch (fileType) {
      case "xlsx": {
        //XLSXファイル書き出し設定
        const [writeFileName, writeFilePath] = getFileNameAndPath("xlsx");
        //フォルダが存在するか確認
        handleCheckFolder(writeFilePath);
        //書き出し
        await handleWriteFileAsXLSX(writeFileName, result.data);

        break;
      }

      case "json": {
        //さらにflowごとにフォルダを生成
        const writeFileDir = writeFileRootDir + `/${flowName}/`;
        await handleMakeDir(writeFileDir);
        const writeFileName = `${flowName}_${stepName}.json`;

        //書き出し
        return await fs.writeFile(
          writeFileDir + writeFileName,
          JSON.stringify(result)
        );
      }

      default:
        break;
    }
  }
};

const handleMakeDir = async (pathlike) => {
  try {
    await fs.access(pathlike);
  } catch (e) {
    try {
      await fs.mkdir(pathlike);
    } catch (e) {}
  }
};

const getFileNameAndPath = (writeFileType) => {
  const now = new Date();
  const fileNameDateString = `${now.getFullYear()}.${
    now.getMonth() + 1
  }.${now.getDate()}-${now.getHours()}${now.getMinutes()}-${now.getSeconds()}${now.getMilliseconds()}`;
  const writeFilePath = path.resolve(
    __dirname,
    "../../result/" + writeFileType
  );

  const writeFileName = path.resolve(
    writeFilePath,
    "result-" + fileNameDateString + `.${writeFileType}`
  );

  return [writeFileName, writeFilePath];
};

const handleCheckFolder = async (writeFilePath) => {
  //書き込み対象のディレクトリが存在するか確認
  try {
    await fs.lstat(writeFilePath);
  } catch (e) {
    /**
     * no such file or directory Error no
     * mac: -2 / windows: -4058
     */
    if (e.errno === -4058 || e.errno === -2) fs.mkdir(writeFilePath);
    else throw new Error(e);
  }
};

const handleWriteFileAsJSON = async (writeFileName, result) => {
  return await fs.writeFile(writeFileName, JSON.stringify(result));
};

const handleWriteFileAsXLSX = async (writeFileName, data, axisNames) => {
  const now = new Date();
  try {
    //XLSXのworkbookオブジェクト準備
    const wb = XLSX.utils.book_new();

    for (let i = 0; i < data.length; i++) {
      const thisSpaceArrayOfPop = data[i];
      const parsedResult = [axisNames, ...thisSpaceArrayOfPop];
      const sheetName = `Space no.${i}`;
      wb.SheetNames.push(sheetName);
      wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(parsedResult);
    }

    //XLSXファイル設定&書き出し
    wb.Props = {
      Title: "people-flow-simulation result",
      Subject: "",
      Author: "",
      CreatedDate: new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      ),
    };
    await XLSX.writeFile(wb, writeFileName);
    return true;
  } catch (e) {
    console.log("failed to write XLSX result file due to below error.");
    console.error(e);
    return false;
  }
};

module.exports = { writeFile };

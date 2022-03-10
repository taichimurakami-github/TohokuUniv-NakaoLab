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

  console.log("\n");

  //ファイル生成
  for (const fileType of writeFiletypes) {
    const writeFileRootDir = path.resolve(
      __dirname,
      "../../result/" + fileType + "/" + dateString
    );
    //書き出しフォルダを生成
    await handleMakeDir(writeFileRootDir); //日付のフォルダが無ければ作成
    const writeFileDir = writeFileRootDir + `/${flowName}/`;
    await handleMakeDir(writeFileDir);
    const writeFileName = `${flowName}_${stepName}.${fileType}`;

    //ファイル拡張子ごとに処理
    switch (fileType) {
      case "xlsx": {
        console.log(writeFileName);
        //書き出し
        await handleWriteFileAsXLSX(
          writeFileDir + writeFileName,
          result,
          result.axisNames
        );

        break;
      }

      case "json": {
        console.log(writeFileName);
        //書き出し
        await fs.writeFile(
          writeFileDir + writeFileName,
          JSON.stringify(result)
        );

        break;
      }

      default:
        break;
    }
  }
};

const handleMakeDir = async (pathlike) => {
  await fs.access(pathlike).catch(async (e) => {
    await fs.mkdir(pathlike).catch((e) => {});
  });
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

const handleWriteFileAsXLSX = async (writeFileName, result, axisNames) => {
  const data = result.data; //:resultTemplate
  const now = new Date();
  try {
    //XLSXのworkbookオブジェクト準備
    const wb = XLSX.utils.book_new();

    //発症者のみ抜き出し
    //ラベル生成とデータ整形

    const I_SUM_SHEET_AXIS_NAME = [];
    const timeLength = data[0].length;
    const spaceLength = data.length;

    /**
     * 特定のデータのみを１つのシートにまとめて書き出す
     */
    const I_only_result = [];
    const I_POSITION = 3;

    //Iのみを抜き出す(for exp2)

    // for (let i = 0; i < spaceLength; i++) {
    //   I_SUM_SHEET_AXIS_NAME.push(`Space${i}`);
    // }

    // for (let t = 0; t < timeLength; t++) {
    //   I_only_result.push([]);
    //   for (let i = 0; i < data.length; i++) {
    //     I_only_result[t].push(data[i][t][I_POSITION]);
    //   }
    // }
    // wb.SheetNames.push("analysis");
    // wb.Sheets["I_only"] = XLSX.utils.aoa_to_sheet([
    //   I_SUM_SHEET_AXIS_NAME,
    //   ...I_only_result,
    // ]);

    //新規感染者のみ抜き出す(for exp4)
    const newInfectiousLog = result.newInfectious; //:number[][]
    const I_new_only_result = [];

    const specifySpaceID = (i) => {
      const valid = [0, 8, 12, 18, 21];
      return valid.includes(i);
    };

    for (let i = 0; i < spaceLength; i++) {
      specifySpaceID(i) && I_SUM_SHEET_AXIS_NAME.push(`Space${i}`);
    }

    for (let t = 0; t < timeLength; t++) {
      I_new_only_result.push([]);

      for (let i = 0; i < spaceLength; i++) {
        const new_I_data = newInfectiousLog[i];
        specifySpaceID(i) && I_new_only_result[t].push(new_I_data[t]);
      }
    }

    wb.SheetNames.push("new_I_only");
    wb.Sheets["new_I_only"] = XLSX.utils.aoa_to_sheet([
      I_SUM_SHEET_AXIS_NAME,
      ...I_new_only_result,
    ]);

    /**
     * 全てのデータを、空間ごとにシートを分けて行う
     */
    //データ書き出し
    for (let i = 0; i < data.length; i++) {
      const thisSpaceArrayOfPop = data[i];
      const parsedResult = [axisNames, ...thisSpaceArrayOfPop];
      const sheetName = `Space${i}`;
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

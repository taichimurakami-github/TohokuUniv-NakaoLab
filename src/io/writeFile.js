//module import
const fs = require("fs").promises;
const path = require("path");
const XLSX = require("xlsx");

/**
 * 計算結果をXLSX形式で書き出し
 * @param {array of array} data
 * @returns
 */
const writeFile = async (data, axisNames) => {
  //XLSXファイル書き出し設定
  const now = new Date();
  const fileNameDateString = `${now.getFullYear()}.${
    now.getMonth() + 1
  }.${now.getDate()}-${now.getHours()}${now.getMinutes()}-${now.getSeconds()}${now.getMilliseconds()}`;
  const writeFileType = "xlsx";
  const writeFilePath = path.resolve(__dirname, "../../result");
  const writeFileName = path.resolve(
    writeFilePath,
    "result-" + fileNameDateString + `.${writeFileType}`
  );

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

    // console.log(wb.Sheets);

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
    XLSX.writeFile(wb, writeFileName);
    return true;
  } catch (e) {
    console.log("failed to write XLSX result file due to below error.");
    console.error(e);
    return false;
  }
};

module.exports = { writeFile };

const fs = require('fs').promises;
const path = require("path");
const XLSX = require("xlsx");

const readFile = async (filePath) => {
  console.log(`reading files: ${filePath}`);
  const fileType = filePath.split(".").pop()

  switch (fileType) {
    case 'json':
      console.log("reading json file...")
      return JSON.parse(await fs.readFile(filePath, 'utf-8'));

    default:
      return await fs.readFile(filePath, 'utf-8');
  }
}

const showProgressOnConsole = (now, total, barLength) => {
  const finishedRate = now / total;

  return
}

const writeFile = async (data) => {
  //XLSXファイル書き出し設定
  const now = new Date();
  const fileNameDateString = `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}-${now.getHours()}${now.getMinutes()}-${now.getSeconds()}${now.getMilliseconds()}`;
  const writeFileType = "xlsx";
  const writeFilePath = path.resolve(__dirname, "../../result");
  const writeFileName = path.resolve(writeFilePath, "result-" + fileNameDateString + `.${writeFileType}`);

  //書き込み対象のディレクトリが存在するか確認
  try {

    await fs.lstat(writeFilePath);

  } catch (e) {

    if (e.errno === -4058) fs.mkdir(writeFilePath);
    else throw new Error(e);

  }

  try {

    //XLSXのworkbookオブジェクト準備
    const wb = XLSX.utils.book_new();
    const sheetName = "result";

    wb.Props = {
      Title: "people-flow-simulation result",
      Subject: "",
      Author: "",
      CreatedDate: new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
    };

    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = XLSX.utils.aoa_to_sheet(data);

    //XLSXファイル書き出し
    XLSX.writeFile(wb, writeFileName);
    return true;

  } catch (e) {

    console.log("failed to write XLSX result file due to below error.");
    console.error(e);
    return false;

  }
}

module.exports = { readFile, writeFile }
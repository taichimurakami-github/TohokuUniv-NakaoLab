const fs = require('fs');
const XLSX = require("xlsx");

const readFile = (path) => {
  console.log(`reading files: ${path}`);
  const fileType = path.split(".").pop()

  switch (fileType) {
    case 'json':
      console.log("reading json file...")
      return JSON.parse(fs.readFileSync(path, 'utf-8'));

    default:
      return fs.readFileSync(path, 'utf-8');
  }
}

const showProgressOnConsole = (now, total, barLength) => {
  const finishedRate = now / total;

  return
}

const writeFile = async (data, options) => {

}

module.exports = { readFile, writeFile }
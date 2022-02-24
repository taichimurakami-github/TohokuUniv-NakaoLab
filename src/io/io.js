const {
  showProgressOnConsole,
  showResultOnConsole,
  showConfigOnConsole,
} = require("./handleConsole");
const { readFile } = require("./readFile");
const { writeFile } = require("./writeFile");

/**
 * IO hander class
 */
class IO {
  static readFile = (filePath) => readFile(filePath);

  static writeFile = (...args) => writeFile(...args);

  static showProgressOnConsole = (now, total) =>
    showProgressOnConsole(now, total);

  static showConfigOnConsole = (config) => showConfigOnConsole(config);

  static showResultOnConsole = (calcResult) => showResultOnConsole(calcResult);
}

module.exports = { IO };

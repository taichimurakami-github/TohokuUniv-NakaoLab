const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

const getNumArrayAmount = (target) => target.reduce((sum, currentval) => sum + currentval);

const getNumArrayAverage = (target, parseMode = "default") => {
  const result = getPeopleAmount(target) / target.length;

  switch (parseMode) {
    case "floor": return Math.floor(result);//小数点以下切り捨て
    case "round": return Math.round(result);//小数点以下四捨五入
    default: return result;//そのまま返す
  }
}

module.exports = { getRandomFloat, getNumArrayAmount, getNumArrayAverage };
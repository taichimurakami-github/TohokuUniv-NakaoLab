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


const getIntArrayAmount = (arr) => {
  let sum = 0;
  for (const val of arr) sum += val;
  return sum;
}

const getMaxAndMinFromIntArray = (arr) => {
  let max = 0;
  let min = arr[0];
  for (const val of arr) {
    if (val > max) max = val;
    if (val < min) min = val;
  }

  return { min: min, max: max };
}


module.exports = { getRandomFloat, getNumArrayAmount, getNumArrayAverage, getIntArrayAmount, getMaxAndMinFromIntArray };
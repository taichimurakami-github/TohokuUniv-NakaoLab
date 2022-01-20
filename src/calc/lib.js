/**
 * 引数で与えられた最大値と最小値の間で、ランダムな小数の値を返す
 * @param {float | int} min
 * @param {float | int} max
 * @returns
 */
const getRandomFloat = (min, max) => Math.random() * (max - min) + min;

/**
 * float | int　の配列内の要素の合計値を返す
 * @param {[int | float]} target
 * @returns
 */
const getNumArrayAmount = (target) =>
  target.reduce((sum, currentval) => sum + currentval);

/**
 * float | int の配列内の要素の平均値を返す
 * @param {[int | float]} target
 * @param {string} parseMode
 * @returns
 */
const getNumArrayAverage = (target, parseMode = "default") => {
  const result = getPeopleAmount(target) / target.length;

  switch (parseMode) {
    case "floor":
      return Math.floor(result); //小数点以下切り捨て
    case "round":
      return Math.round(result); //小数点以下四捨五入
    default:
      return result; //そのまま返す
  }
};

/**
 * getNumArray()と同じだけど間違えて作ってしまったのでそのまま使用
 * @param {[int]} arr
 * @returns
 */
const getIntArrayAmount = (arr) => {
  let sum = 0;
  for (const val of arr) sum += val;
  return sum;
};

/**
 * float | int 配列内の要素の中から、最大値と最小値を返す
 * @param {[int | float]} arr
 * @returns
 */
const getMaxAndMinFromIntArray = (arr) => {
  let max = 0;
  let min = arr[0];
  for (const val of arr) {
    if (val > max) max = val;
    if (val < min) min = val;
  }

  return { min: min, max: max };
};

/**
 * 配列の要素の中から、m個の組み合わせを重複なしですべて抽出する
 * @param {Array} source
 * @param {Integer} m
 * @returns
 */
const calcCombination = (source, m) => {
  const getCombination = (subset, begin, end) => {
    let r = [];
    for (let i = begin; i < end; i++) {
      //帰ってきた結果subsetと、探索該当要素のsource[i]を融合
      const tmp = [...subset, source[i]];
      if (source.length === end) {
        //全探索終了、tmpには組み合わせが一つ保持される
        // r.push(tmp);
        r.push(tmp);
      } else {
        //下層探索開始
        r = [...r, ...getCombination(tmp, i + 1, end + 1)];
      }
    }

    return r;
  };

  return getCombination([], 0, source.length - (m - 1));
};

module.exports = {
  getRandomFloat,
  getNumArrayAmount,
  getNumArrayAverage,
  getIntArrayAmount,
  getMaxAndMinFromIntArray,
  calcCombination,
};

const { NI } = require("../NewBasicStates/NotInfected");

const variantDefaults = [
  {
    strainType: "E",
    infectivity: 0.1,
    resilience: 0.3,
  },
  {
    strainType: "M_2",
    infectivity: 0.1,
    resilience: 0.3,
  },
  {
    strainType: "M_3",
    infectivity: 0.1,
    resilience: 0.3,
  },
  {
    strainType: "M_4",
    infectivity: 0.1,
    resilience: 0.3,
  },
];

const Calculation = (n_variant) => {
  //各基底状態間のパラメータを自動生成
  //一次感染フェーズ以降を計算
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
        r.push(tmp);
      } else {
        //下層探索開始
        r.push(getCombination(tmp, i + 1, end + 1));
      }
    }

    return r;
  };

  return getCombination([], 0, source.length - (m - 1));
};

module.exports = { calcCombination };

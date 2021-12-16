const { getRandomFloat } = require("./lib");

const generateCoeffMatrix = (space, max_coeff_const) => {
  const coeffMatrix = [];

  for (let i_from = 0; i_from < space.length; i_from++) {
    //coeffMatrixに行を追加
    coeffMatrix.push([]);

    for (let i_to = 0; i_to < space.length; i_to++) {
      // coeffの範囲を動的に取得（MAX_COEFF * space.length < 1を満たすように取得）
      // とりあえず 1 / space.length / 10とした
      const COEFF_MAX = (1 / space.length) * max_coeff_const;
      const COEFF_MIN = COEFF_MAX * 0.001;

      //i_From === i_toの時は係数を0にする
      coeffMatrix[i_from][i_to] = (i_from === i_to) ? 0 : getRandomFloat(COEFF_MIN, COEFF_MAX);
    }
  }

  return coeffMatrix;
}

module.exports = { generateCoeffMatrix };
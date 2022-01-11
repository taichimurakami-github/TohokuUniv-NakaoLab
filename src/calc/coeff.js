const { getRandomFloat } = require("./lib");

/**
 * 人口の流出・流入をつかさどる係数を生成する
 * @param {[int | float]} space
 * @param {float} max_coeff_const
 * @returns
 */
const generateCoeffMatrix = (space, max_coeff_const) => {
  const coeffMatrix = [];

  for (let i_from = 0; i_from < space.length; i_from++) {
    //coeffMatrixに行を追加
    coeffMatrix.push([]);

    for (let i_to = 0; i_to < space.length; i_to++) {
      // coeffの範囲を動的に取得（MAX_COEFF * space.length < 1を満たすように取得）
      // とりあえず max_coeff_const / space.lengthとした
      const COEFF_MAX = (1 / space.length) * max_coeff_const;
      const COEFF_MIN = COEFF_MAX * 0.001;

      //i_From === i_toの時は係数を0にする
      coeffMatrix[i_from][i_to] =
        i_from === i_to ? 0 : getRandomFloat(COEFF_MIN, COEFF_MAX);
    }
  }

  return coeffMatrix;
};

const changeEqStateAndConst = (t, options) => {
  const nowState = options.nowState;
  const eqConst = options.eqConst;
  const config = options.config;

  switch (t) {
    //流行型への再感染者の発生
    //RE -> Sへの遷移開始
    case 1: {
      nowState.I_RE_E += nowState.R_E * eqConst.beta_RE_E;
      nowState.R_E -= nowState.R_E * eqConst.beta_RE_E;
      return {
        sigma_RE_S: 0.05,
      };
    }

    //ウイルス変異に伴うパラメータ群の調整
    //RM -> Sへの遷移開始
    case config.params.mutationBeginTime: {
      console.log("begin mutation");
      //nowSpaceの値を変更
      nowState.I_M += eqConst.EPSILON_M !== 0 ? eqConst.EPSILON_M : 0;
      nowState.I_RE_M += 100;
      nowState.R_E -= 100;

      //equation paramater を調整
      return {
        beta_M: 0.85,
        epsilon_EM: 0.05,
      };
    }

    //ウイルス変異に伴うパラメータの調整（I_REM_M, I_REM_E）
    //R_EM -> R_E, R_Mへの遷移開始
    //変異が起きた次のステップで発生する
    case config.params.mutationBeginTime + 5: {
      nowState.I_RM_E += 100;
      nowState.I_RM_M += 100;
      nowState.I_REM_E += 100;
      nowState.I_REM_M += 100;

      return {
        beta_RE_M: 0.6,

        sigma_RM_S: 0.05,
        sigma_REM_RE: 0.05,
        sigma_REM_RM: 0.05,
      };
    }

    default:
      break;
  }
};

module.exports = { generateCoeffMatrix, changeEqStateAndConst };

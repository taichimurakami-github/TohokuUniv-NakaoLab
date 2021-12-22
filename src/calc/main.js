/**
 * 1フェーズ分の人流を計算し、移動後の新たな人口分布を生成する
 * @param {array} space 
 * @param {array of array} coeffMatrix 
 * @returns 
 */
const generateNewPeopleDist = (space, coeffMatrix) => {

  // とりあえず引数の配列をコピー
  const newSpace = space.map(val => val);

  //diff arrayを生成 >> 人流移動を考えるとき、すべての空間から同時に流出と流入が起こると仮定するため、ベースの数字を固定する
  const diff = [];

  for (let i = 0; i < space.length; i++) diff.push({ plus: 0, minus: 0 });

  for (let i_from = 0; i_from < space.length; i_from++) {

    //現在対象の空間以外の全ての空間に一定の割合で人が流出
    for (let i_to = 0; i_to < space.length; i_to++) {

      if (i_from === i_to) continue;

      const outflow = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from]);
      diff[i_from].minus += outflow;
      diff[i_to].plus += outflow;
    }
  }

  return newSpace.map((val, index) => {
    //とりあえずparseする
    const r = Math.round(val + diff[index].plus - diff[index].minus);

    //もし負の値になったら計算中止
    if (r < 0) throw new Error(`計算結果が不正です：${index} 番目の値が ${r} でした`);

    return r;
  });
}


const generateNewEquationState = (nowState, C) => {

  //diff state を管理するdiff objを生成後、すべてのdiffの値を0に初期化
  const diff = {};

  //now stateをコピー
  const now = { ...nowState };
  const next = {};

  //計算
  diff.S = (C.sigma_RE_S * now.R_E + C.sigma_RM_S * now.R_M) - (C.beta_E + C.beta_M + C.mu_S) * now.S;
  diff.I_E = (C.beta_E * now.S) - (C.mu_E + C.gamma_E + C.mu_E + C.epsilon_EM) * now.I_E;
  diff.I_M = (C.beta_M * now.S + C.epsilon_EM * now.I_E + C.EPSILON_M) - (C.gamma_M + C.mu_M) * now.I_M;
  diff.R_E = (C.gamma_E * now.I_E + C.sigma_REM_RE * now.R_EM + C.gamma_RE_E * now.I_RE_E) - (C.beta_RE_E + C.beta_RE_M + C.sigma_RE_S + C.mu_RE) * now.R_E;
  diff.R_M = (C.gamma_M * now.I_M + C.sigma_REM_RM * now.R_EM + C.gamma_RM_M * now.I_RM_M) - (C.beta_RM_M + C.beta_RM_E + C.sigma_RM_S + C.mu_RM) * now.R_M;
  diff.I_RE_E = (C.beta_RE_E * now.R_E) - (C.gamma_RE_E + C.mu_RE_E) * now.I_RE_E;
  diff.I_RM_M = (C.beta_RM_M * now.R_M) - (C.gamma_RM_M + C.mu_RM_M) * now.I_RM_M;
  diff.I_RE_M = (C.beta_RE_M * now.R_E) - (C.gamma_RE_M + C.mu_RE_M) * now.I_RE_M;
  diff.I_RM_E = (C.beta_RM_E * now.R_M) - (C.gamma_RM_E + C.mu_RM_E) * now.I_RM_E;
  diff.R_EM = (C.gamma_RE_M * now.I_RE_M + C.gamma_RM_E * now.I_RM_E + C.gamma_REM_E * now.I_REM_E + C.gamma_REM_M * now.I_REM_M) - (C.beta_REM_E + C.beta_REM_M + C.sigma_REM_RE + C.sigma_REM_RM + C.mu_REM) * now.R_EM;
  diff.I_REM_E = (C.beta_REM_E * now.R_EM) - (C.gamma_REM_E + C.mu_REM_E) * now.I_REM_E;
  diff.I_REM_M = (C.beta_REM_M * now.R_EM) - (C.gamma_REM_M + C.mu_REM_M) * now.I_REM_M;

  // console.log(diff);


  for (const [key, value] of Object.entries(diff)) {
    //next = now + diff
    next[key] = now[key] + Math.round(value);

    if (next[key] < 0) {
      console.log(next[key]);
      throw new Error("invalid calculation: negative value exists.");
    }
  }

  return next;
}


module.exports = { generateNewEquationState };
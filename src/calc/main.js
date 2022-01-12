const generateNewEquationState = (p) => {
  //diff state を管理するdiff objを生成後、すべてのdiffの値を0に初期化
  //計算
  const diff = calculateEquation(p);

  //diffを保存
  for (const [key, value] of Object.entries(diff)) {
    p[key].setDiff(value);
  }

  return;
};

const calculateEquation = (p) => {
  const diff = {};
  const sum = p.getSum();
  const sum_E = p.getSum("E");
  const sum_M = p.getSum("M");
  //muによる死亡率は、setDiff()を実行する際に自動で反映される
  // diff.S =
  //   C.sigma_RE_S * now.R_E +
  //   C.sigma_RM_S * now.R_M -
  //   (C.beta_E * now.S * CALC.SUM_E_infected) / sum -
  //   (C.beta_M * now.S * CALC.SUM_M_infected) / sum -
  //   C.mu_S * now.S;

  diff.S =
    p.R_E.changeTo(p.S) +
    p.R_M.changeTo(p.S) -
    p.S.changeTo(p.I_E, sum, sum_E) -
    p.S.changeTo(p.I_M, sum, sum_M);

  if (isNaN(diff.S)) throw new Error("NAN");

  // diff.I_E =
  //   (C.beta_E * now.S * CALC.SUM_E_infected) / sum -
  //   (C.mu_E + C.gamma_E + C.epsilon_EM) * now.I_E;

  diff.I_E =
    p.S.changeTo(p.I_E, sum, sum_E) -
    p.I_E.changeTo(p.I_M, sum, sum_M) -
    p.I_E.changeTo(p.R_E);

  // diff.I_M =
  //   C.epsilon_EM * now.I_E +
  //   (C.beta_M * now.S * CALC.SUM_M_infected) / sum -
  //   (C.gamma_M + C.mu_M) * now.I_M;

  diff.I_M =
    p.S.changeTo(p.I_M, sum, sum_M) +
    p.I_E.changeTo(p.I_M, sum, sum_M) -
    p.I_M.changeTo(p.R_M);

  // diff.R_E =
  //   C.gamma_E * now.I_E +
  //   C.gamma_RE_E * now.I_RE_E +
  //   C.sigma_REM_RE * now.R_EM -
  //   (C.beta_RE_E * now.R_E * CALC.SUM_E_infected) / sum -
  //   (C.beta_RE_M * now.R_E * CALC.SUM_M_infected) / sum -
  //   (C.sigma_RE_S + C.mu_RE) * now.R_E;

  diff.R_E =
    p.I_E.changeTo(p.R_E) +
    p.I_RE_E.changeTo(p.R_E) +
    p.R_EM.changeTo(p.R_E) -
    p.R_E.changeTo(p.I_RE_E, sum, sum_E) -
    p.R_E.changeTo(p.I_RE_M, sum, sum_M) -
    p.R_E.changeTo(p.S);

  // diff.R_M =
  //   C.gamma_M * now.I_M +
  //   C.gamma_RM_M * now.I_RM_M +
  //   C.sigma_REM_RM * now.R_EM -
  //   (C.beta_RM_M * now.R_M * CALC.SUM_M_infected) / sum -
  //   (C.beta_RM_E * now.R_M * CALC.SUM_E_infected) / sum -
  //   (C.sigma_RM_S + C.mu_RM) * now.R_M;

  diff.R_M =
    p.I_M.changeTo(p.R_M) +
    p.I_RM_M.changeTo(p.R_M) +
    p.R_EM.changeTo(p.R_M) -
    p.R_M.changeTo(p.I_RM_M, sum, sum_M) -
    p.R_M.changeTo(p.I_RM_E, sum, sum_E) -
    p.R_M.changeTo(p.S);

  // diff.I_RE_E =
  //   (C.beta_RE_E * now.R_E * CALC.SUM_E_infected) / sum -
  //   (C.gamma_RE_E + C.mu_RE_E) * now.I_RE_E;

  diff.I_RE_E = p.R_E.changeTo(p.I_RE_E, sum, sum_E) - p.I_RE_E.changeTo(p.R_E);

  // diff.I_RE_M =
  //   (C.beta_RE_M * now.R_E * CALC.SUM_M_infected) / sum -
  //   (C.gamma_RE_M + C.mu_RE_M) * now.I_RE_M;
  diff.I_RE_M =
    p.R_E.changeTo(p.I_RE_M, sum, sum_M) - p.I_RE_M.changeTo(p.R_EM);

  // diff.I_RM_M =
  //   (C.beta_RM_M * now.R_M * CALC.SUM_M_infected) / sum -
  //   (C.gamma_RM_M + C.mu_RM_M) * now.I_RM_M;

  diff.I_RM_M = p.R_M.changeTo(p.I_RM_M, sum, sum_M) - p.I_RM_M.changeTo(p.R_M);

  // diff.I_RM_E =
  //   (C.beta_RM_E * now.R_M * CALC.SUM_E_infected) / sum -
  //   (C.gamma_RM_E + C.mu_RM_E) * now.I_RM_E;

  diff.I_RM_E =
    p.R_M.changeTo(p.I_RM_E, sum, sum_E) - p.I_RM_E.changeTo(p.R_EM);

  // diff.R_EM =
  //   C.gamma_RE_M * now.I_RE_M +
  //   C.gamma_RM_E * now.I_RM_E +
  //   C.gamma_REM_E * now.I_REM_E +
  //   C.gamma_REM_M * now.I_REM_M -
  //   (C.beta_REM_E * now.R_EM * CALC.SUM_E_infected) / sum -
  //   (C.beta_REM_M * now.R_EM * CALC.SUM_M_infected) / sum -
  //   (C.sigma_REM_RE + C.sigma_REM_RM + C.mu_REM) * now.R_EM;
  diff.R_EM =
    p.I_RE_M.changeTo(p.R_EM) +
    p.I_RM_E.changeTo(p.R_EM) +
    p.I_REM_E.changeTo(p.R_EM) +
    p.I_REM_M.changeTo(p.R_EM) -
    p.R_EM.changeTo(p.I_REM_E, sum, sum_E) -
    p.R_EM.changeTo(p.I_REM_M, sum, sum_M) -
    p.R_EM.changeTo(p.R_E) -
    p.R_EM.changeTo(p.R_M);

  // diff.I_REM_E =
  //   (C.beta_REM_E * now.R_EM * CALC.SUM_E_infected) / sum -
  //   (C.gamma_REM_E + C.mu_REM_E) * now.I_REM_E;

  diff.I_REM_E =
    p.R_EM.changeTo(p.I_REM_E, sum, sum_E) - p.I_REM_E.changeTo(p.R_EM);

  // diff.I_REM_M =
  //   (C.beta_REM_M * now.R_EM * CALC.SUM_M_infected) / sum -
  //   (C.gamma_REM_M + C.mu_REM_M) * now.I_REM_M;
  diff.I_REM_M =
    p.R_EM.changeTo(p.I_REM_M, sum, sum_M) - p.I_REM_M.changeTo(p.R_EM);

  //計算結果をチェック(mu以外のdiff合計値 > nextPeopleStates.sum の場合はエラー)
  let nextSum;
  for (const diffVal of Object.values(diff)) {
    nextSum += diffVal;
  }
  if (nextSum > p.getSum()) {
    throw new Error("invalid calculation: surpass before population amount");
  }

  return diff;
};

const getInfectionCoeff = (beta, activityDist) => {
  //感染率をそれぞれ定義
  const high = (beta * (1 - beta)) / 2;
  const mid = beta;
  const low = beta * 0.2;

  //beta * activityDist.stateの和を返す
  return (
    high * activityDist.high + mid * activityDist.mid + low * activityDist.low
  );
};

const getActivityDist = () => {
  return {
    high: 0,
    mid: 0,
    low: 0,
  };
};

module.exports = { generateNewEquationState };

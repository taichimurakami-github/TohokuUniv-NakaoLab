const generateNewEquationState = (nowState, C, sum, options = {}) => {
  //diff state を管理するdiff objを生成後、すべてのdiffの値を0に初期化
  const diff = {};

  //now stateをコピー
  const now = { ...nowState };
  const next = {};

  const CALC = {
    SUM_E_infected:
      now.I_E +
      now.I_RE_E * C.theta_RE_E +
      now.I_RM_E * C.theta_RM_E +
      now.I_REM_E * C.theta_REM_E,
    SUM_M_infected:
      now.I_M +
      now.I_RM_M * C.theta_RM_M +
      now.I_RE_M * C.theta_RE_M +
      now.I_REM_M * C.theta_REM_M,
  };

  //計算
  diff.S =
    C.sigma_RE_S * now.R_E +
    C.sigma_RM_S * now.R_M -
    (C.beta_E * now.S * CALC.SUM_E_infected) / sum -
    (C.beta_M * now.S * CALC.SUM_M_infected) / sum -
    C.mu_S * now.S;

  diff.I_E =
    (C.beta_E * now.S * CALC.SUM_E_infected) / sum -
    (C.mu_E + C.gamma_E + C.epsilon_EM) * now.I_E;

  diff.I_M =
    C.EPSILON_M +
    C.epsilon_EM * now.I_E +
    (C.beta_M * now.S * CALC.SUM_M_infected) / sum -
    (C.gamma_M + C.mu_M) * now.I_M;

  diff.R_E =
    C.gamma_E * now.I_E +
    C.gamma_RE_E * now.I_RE_E +
    C.sigma_REM_RE * now.R_EM -
    (C.beta_RE_E * now.R_E * CALC.SUM_E_infected) / sum -
    (C.beta_RE_M * now.R_E * CALC.SUM_M_infected) / sum -
    (C.sigma_RE_S + C.mu_RE) * now.R_E;

  diff.R_M =
    C.gamma_M * now.I_M +
    C.gamma_RM_M * now.I_RM_M +
    C.sigma_REM_RM * now.R_EM -
    (C.beta_RM_M * now.R_M * CALC.SUM_M_infected) / sum -
    (C.beta_RM_E * now.R_M * CALC.SUM_E_infected) / sum -
    (C.sigma_RM_S + C.mu_RM) * now.R_M;

  diff.I_RE_E =
    (C.beta_RE_E * now.R_E * CALC.SUM_E_infected) / sum -
    (C.gamma_RE_E + C.mu_RE_E) * now.I_RE_E;

  diff.I_RM_M =
    (C.beta_RM_M * now.R_M * CALC.SUM_M_infected) / sum -
    (C.gamma_RM_M + C.mu_RM_M) * now.I_RM_M;

  diff.I_RE_M =
    (C.beta_RE_M * now.R_E * CALC.SUM_M_infected) / sum -
    (C.gamma_RE_M + C.mu_RE_M) * now.I_RE_M;

  diff.I_RM_E =
    (C.beta_RM_E * now.R_M * CALC.SUM_E_infected) / sum -
    (C.gamma_RM_E + C.mu_RM_E) * now.I_RM_E;

  diff.R_EM =
    C.gamma_RE_M * now.I_RE_M +
    C.gamma_RM_E * now.I_RM_E +
    C.gamma_REM_E * now.I_REM_E +
    C.gamma_REM_M * now.I_REM_M -
    (C.beta_REM_E * now.R_EM * CALC.SUM_E_infected) / sum -
    (C.beta_REM_M * now.R_EM * CALC.SUM_M_infected) / sum -
    (C.sigma_REM_RE + C.sigma_REM_RM + C.mu_REM) * now.R_EM;

  diff.I_REM_E =
    (C.beta_REM_E * now.R_EM * CALC.SUM_E_infected) / sum -
    (C.gamma_REM_E + C.mu_REM_E) * now.I_REM_E;

  diff.I_REM_M =
    (C.beta_REM_M * now.R_EM * CALC.SUM_M_infected) / sum -
    (C.gamma_REM_M + C.mu_REM_M) * now.I_REM_M;

  //チェック用の数を定義
  let diffSum = 0;
  let nextSum = 0;

  for (const [key, value] of Object.entries(diff)) {
    //next = now + diff
    // next[key] = now[key] + Math.round(value);
    next[key] = now[key] + Math.floor(value);
    // next[key] = now[key] + value;

    //チェック用に合計を取る
    nextSum += next[key];
    diffSum += value;

    if (next[key] < 0) {
      console.log(next[key]);
      throw new Error("invalid calculation: negative value exists.");
    }
  }

  // options.t >= options.mutationBeginTime &&
  if (nextSum > sum + C.EPSILON_M) {
    // console.log("\n\nconst: ");
    // console.log(C);
    console.log("ERROR AT t =", options.t, "\n");
    console.log(CALC.SUM_M_infected / sum, CALC.SUM_E_infected / sum, "\n");
    console.log(now);
    console.log("nowSum =", sum, "\n\n");
    console.log(diff);
    console.log("diffSum =", diffSum, "\n\n");
    console.log(next);
    console.log("nextSum =", nextSum, "\n");
    throw new Error("invalid calculation: surpass before population amount");
  }

  if (
    C.epsilon_EM > 0 &&
    options.t > options.mutationBeginTime &&
    options.t < options.mutationBeginTime + 10
  ) {
    console.log("\n\n", now.I_E, C.epsilon_EM, C.epsilon_EM * now.I_E);
    console.log("now: ");
    console.log(now);
  }

  //M系、E系の感染者の総和を格納
  next.SUM_I_EX = next.I_E + next.I_RE_E + next.I_RM_E + next.I_REM_E;
  next.SUM_I_MX = next.I_M + next.I_RE_M + next.I_RM_M + next.I_REM_M;

  return next;
};

module.exports = { generateNewEquationState };

// diff.S =
//   C.sigma_RE_S * now.R_E +
//   C.sigma_RM_S * now.R_M -
//   (C.beta_E * now.S * now.I_E) / sum -
//   (C.beta_M * now.S * now.I_M) / sum -
//   C.mu_S * now.S;

// diff.I_E =
//   (C.beta_E * now.S * now.I_E) / sum -
//   (C.mu_E + C.gamma_E + C.mu_E + C.epsilon_EM) * now.I_E;

// diff.I_M =
//   (C.beta_M * now.S * now.I_M) / sum +
//   C.epsilon_EM * now.I_E +
//   C.EPSILON_M -
//   (C.gamma_M + C.mu_M) * now.I_M;

// diff.R_E =
//   C.gamma_E * now.I_E +
//   C.sigma_REM_RE * now.R_EM +
//   C.gamma_RE_E * now.I_RE_E -
//   (C.beta_RE_E + C.beta_RE_M + C.sigma_RE_S + C.mu_RE) * now.R_E;

// diff.R_M =
//   C.gamma_M * now.I_M +
//   C.sigma_REM_RM * now.R_EM +
//   C.gamma_RM_M * now.I_RM_M -
//   (C.beta_RM_M + C.beta_RM_E + C.sigma_RM_S + C.mu_RM) * now.R_M;

// diff.I_RE_E = C.beta_RE_E * now.R_E - (C.gamma_RE_E + C.mu_RE_E) * now.I_RE_E;

// diff.I_RM_M = C.beta_RM_M * now.R_M - (C.gamma_RM_M + C.mu_RM_M) * now.I_RM_M;

// diff.I_RE_M = C.beta_RE_M * now.R_E - (C.gamma_RE_M + C.mu_RE_M) * now.I_RE_M;

// diff.I_RM_E = C.beta_RM_E * now.R_M - (C.gamma_RM_E + C.mu_RM_E) * now.I_RM_E;

// diff.R_EM =
//   C.gamma_RE_M * now.I_RE_M +
//   C.gamma_RM_E * now.I_RM_E +
//   C.gamma_REM_E * now.I_REM_E +
//   C.gamma_REM_M * now.I_REM_M -
//   (C.beta_REM_E + C.beta_REM_M + C.sigma_REM_RE + C.sigma_REM_RM + C.mu_REM) *
//     now.R_EM;

// diff.I_REM_E =
//   C.beta_REM_E * now.R_EM - (C.gamma_REM_E + C.mu_REM_E) * now.I_REM_E;

// diff.I_REM_M =
//   C.beta_REM_M * now.R_EM - (C.gamma_REM_M + C.mu_REM_M) * now.I_REM_M;

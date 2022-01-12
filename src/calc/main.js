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

  //muによる死亡率は、setDiff()を実行する際に自動で反映されるため、計算式上では割愛
  diff.S =
    p.R_E.changeTo(p.S) +
    p.R_M.changeTo(p.S) -
    p.S.changeTo(p.I_E, sum, sum_E) -
    p.S.changeTo(p.I_M, sum, sum_M);

  diff.I_E =
    p.S.changeTo(p.I_E, sum, sum_E) -
    p.I_E.changeTo(p.I_M, sum, sum_M) -
    p.I_E.changeTo(p.R_E);

  diff.I_M =
    p.S.changeTo(p.I_M, sum, sum_M) +
    p.I_E.changeTo(p.I_M, sum, sum_M) -
    p.I_M.changeTo(p.R_M);

  diff.R_E =
    p.I_E.changeTo(p.R_E) +
    p.I_RE_E.changeTo(p.R_E) +
    p.R_EM.changeTo(p.R_E) -
    p.R_E.changeTo(p.I_RE_E, sum, sum_E) -
    p.R_E.changeTo(p.I_RE_M, sum, sum_M) -
    p.R_E.changeTo(p.S);

  diff.R_M =
    p.I_M.changeTo(p.R_M) +
    p.I_RM_M.changeTo(p.R_M) +
    p.R_EM.changeTo(p.R_M) -
    p.R_M.changeTo(p.I_RM_M, sum, sum_M) -
    p.R_M.changeTo(p.I_RM_E, sum, sum_E) -
    p.R_M.changeTo(p.S);

  diff.I_RE_E = p.R_E.changeTo(p.I_RE_E, sum, sum_E) - p.I_RE_E.changeTo(p.R_E);

  diff.I_RE_M =
    p.R_E.changeTo(p.I_RE_M, sum, sum_M) - p.I_RE_M.changeTo(p.R_EM);

  diff.I_RM_M = p.R_M.changeTo(p.I_RM_M, sum, sum_M) - p.I_RM_M.changeTo(p.R_M);

  diff.I_RM_E =
    p.R_M.changeTo(p.I_RM_E, sum, sum_E) - p.I_RM_E.changeTo(p.R_EM);

  diff.R_EM =
    p.I_RE_M.changeTo(p.R_EM) +
    p.I_RM_E.changeTo(p.R_EM) +
    p.I_REM_E.changeTo(p.R_EM) +
    p.I_REM_M.changeTo(p.R_EM) -
    p.R_EM.changeTo(p.I_REM_E, sum, sum_E) -
    p.R_EM.changeTo(p.I_REM_M, sum, sum_M) -
    p.R_EM.changeTo(p.R_E) -
    p.R_EM.changeTo(p.R_M);

  diff.I_REM_E =
    p.R_EM.changeTo(p.I_REM_E, sum, sum_E) - p.I_REM_E.changeTo(p.R_EM);

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

module.exports = { generateNewEquationState };

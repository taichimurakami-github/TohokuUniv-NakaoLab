// const { getRandomFloat } = require("./calc/lib");
// const { generateCoeffMatrix } = require("./calc/coeff");
// const { generateNewPeopleDist } = require("./calc/main");
const path = require("path");
const {
  readFile,
  writeFile,
  showProgressOnConsole,
  showResultOnConsole,
  showConfigOnConsole,
} = require("./io/io");
const { generateNewEquationState } = require("./calc/main");
const { initialEqState } = require("./state");
const { initialEqConst } = require("./const");

(async () => {
  /**
   * 設定読み込み
   */
  const config = await readFile(path.resolve(__dirname, "../config.json"));

  /**
   * 計算準備
   */
  const state = [{ ...initialEqState }];
  let eqConst = { ...initialEqConst };

  /**
   * 計算
   */
  console.log("calc start");
  console.log(state[0]);

  for (let t = 0; t < config.params.timeLength; t++) {
    let nowState = { ...state[t] };

    //流行型への再感染者の発生
    //RE -> Sへの遷移開始
    if (t === 1) {
      nowState.I_RE_E += nowState.R_E * eqConst.beta_RE_E;
      nowState.R_E -= nowState.R_E * eqConst.beta_RE_E;
      eqConst = {
        ...eqConst,
        // sigma_RE_S: 0.05,
      };
    }

    //ウイルス変異に伴うパラメータ群の調整
    //RM -> Sへの遷移開始
    if (t === config.params.mutationBeginTime) {
      console.log("begin mutation");
      //equation paramater を調整
      eqConst = {
        ...eqConst,
        beta_M: 0.85,
        epsilon_EM: 0.05,
      };

      //nowSpaceの値を変更
      nowState.I_M += eqConst.EPSILON_M !== 0 ? eqConst.EPSILON_M : 0;
      nowState.I_RE_M += nowState.R_M * 0.01;
      nowState.R_E -= nowState.R_M * 0.01;
    }

    //ウイルス変異に伴うパラメータの調整（I_REM_M, I_REM_E）
    //R_EM -> R_E, R_Mへの遷移開始
    //変異が起きた次のステップで発生する
    if (t - 1 === config.params.mutationBeginTime) {
      // console.log("add new Infection people");
      nowState.I_RM_E += nowState.R_M * eqConst.beta_RM_E * 0.2;
      nowState.I_RM_M += nowState.R_M * eqConst.beta_RM_M * 0.2;
      nowState.R_M -=
        nowState.R_M * (eqConst.beta_RM_E + eqConst.beta_RM_M) * 0.2;

      nowState.I_REM_E += nowState.R_EM * eqConst.beta_REM_E * 0.1;
      nowState.I_REM_M += nowState.R_EM * eqConst.beta_REM_M * 0.1;
      nowState.R_EM -=
        nowState.R_EM * (eqConst.beta_REM_E + eqConst.beta_REM_M) * 0.1;
      // console.log(
      //   eqConst.beta_RM_E + eqConst.beta_RM_M,
      //   eqConst.beta_REM_E + eqConst.beta_REM_M
      // );

      eqConst = {
        ...eqConst,
        beta_RE_M: 0.55,

        // sigma_RM_S: 0.05,
        // sigma_REM_RE: 0.05,
        // sigma_REM_RM: 0.05,
      };
    }

    let sum = 0;
    for (const prop in nowState) sum += nowState[prop];

    const result = {
      ...generateNewEquationState(nowState, eqConst, sum, {
        t: t,
        mutationBeginTime: config.params.mutationBeginTime,
      }),
    };
    state.push(result);

    // if (
    //   config.params.mutationBeginTime - 1 <= t &&
    //   t < config.params.mutationBeginTime + 1
    // ) {
    //   console.log("\n\n\nnowTime: ", t);
    //   console.log("nowstate:");
    //   console.log(nowState);
    //   console.log("\nresult:");
    //   console.log(result);
    // }

    // if (t < 10) {
    //   console.log("\n\n\nnowTime: ", t);
    //   console.log("nowstate:");
    //   console.log(nowState);
    //   console.log("\nresult:");
    //   console.log(result);
    // }
  }

  console.log(state[state.length - 1]);

  const calcResult = [...state];

  /**
   * xlsxファイル出力
   */
  if (config.io.writeResultAsXLSX) {
    console.log("\nwriting result as xlsx file...\n");

    const parsedCalcResult = [
      [
        "S",
        "I_E",
        "I_M",
        "R_E",
        "R_M",
        "I_RE_E",
        "I_RE_M",
        "I_RM_M",
        "I_RM_E",
        "R_EM",
        "I_REM_E",
        "I_REM_M",
        "SUM_I_EX",
        "SUM_I_MX",
      ],
    ];

    for (let i = 0; i < calcResult.length; i++) {
      const pushValue = [];
      for (const prop in calcResult[i]) pushValue.push(calcResult[i][prop]);
      parsedCalcResult.push(pushValue);
    }

    // console.log(parsedCalcResult[parsedCalcResult.length - 1]);

    const writeResult = await writeFile(parsedCalcResult);

    writeResult && console.log("...done!\n\n\n");
  }
})();

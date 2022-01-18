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

const Combination = (valueArr, number, results) => {
  const result = [];

  if (number === 1) {
    // n_C_1
  } else {
    // n_C_m
  }
};

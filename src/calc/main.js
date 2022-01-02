/**
 * 1フェーズ分の人流を計算し、移動後の新たな人口分布を生成する
 * @param {array} space
 * @param {array of array} coeffMatrix
 * @returns
 */
const generateNewPeopleDist = (space, coeffMatrix, eqSettings) => {
  // とりあえず引数の配列をコピー
  const newSpace = [...space];

  //diff arrayを生成 >> 人流移動を考えるとき、すべての空間から同時に流出と流入が起こると仮定するため、ベースの数字を固定する
  const diff = [];

  for (let i = 0; i < space.length; i++) diff.push({ S: 0, I: 0, R: 0 });

  for (let i_from = 0; i_from < space.length; i_from++) {
    //現在対象の空間以外の全ての空間に一定の割合で人が流出
    for (let i_to = 0; i_to < space.length; i_to++) {
      if (i_from === i_to) continue;

      const outflow = {};

      // outflow.S = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from].S);
      // outflow.I = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from].I);
      // outflow.R = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from].R);
      outflow.S = coeffMatrix[i_from][i_to] * newSpace[i_from].S;
      outflow.I =
        coeffMatrix[i_from][i_to] *
        eqSettings.reduceInfectorCoeff *
        newSpace[i_from].I;
      outflow.R = coeffMatrix[i_from][i_to] * newSpace[i_from].R;
      diff[i_from].S -= outflow.S;
      diff[i_from].I -= outflow.I;
      diff[i_from].R -= outflow.R;

      diff[i_to].S += outflow.S;
      diff[i_to].I += outflow.I;
      diff[i_to].R += outflow.R;
    }
  }

  return newSpace.map((val, index) => {
    //とりあえずparseする
    const r = {
      S: val.S + diff[index].S,
      I: val.I + diff[index].I,
      R: val.R + diff[index].R,
    };

    //もし負の値になったら計算中止
    if (r.S < 0 || r.I < 0 || r.R < 0) {
      throw new Error(`計算結果が不正です：${index} 番目の値は ${r} でした`);
    }

    return r;
  });
};

/**
 * 各空間内それぞれに対して、
 * 基本的なSIRモデルに基づいた感染シミュレーションを行う
 *
 * @param {array} space
 * @param {object} C
 */
const simulateInfection = (space, C, t) => {
  const space_afterInfected = [];
  const diff_logArray = [];

  for (let i = 0; i < space.length; i++) {
    //差分配列を用意
    const diff = {};
    const now = { ...space[i] };
    const sum = now.S + now.I + now.R;

    diff.S = now.R * C.sigma - C.beta * now.S * (now.I / sum) - C.mu_S * now.S;
    diff.I = (C.beta * now.S * now.I) / sum - (C.gamma + C.mu_I) * now.I;
    diff.R = now.I * C.gamma - (C.sigma + C.mu_R) * now.R;

    if (t < 10 && i === 0) {
      console.log(now);
      console.log(C.beta * now.S * (now.I / sum), sum);
      console.log(diff);
    }

    // if (diff.S === 0 && diff.I === 0 && diff.R === 0) {
    //   console.log("diff calculation failed");
    //   console.log(now.S, now.I, now.R);
    //   console.log("S >> I", now.S * C.beta);
    //   console.log("I >> R", now.I * C.gamma);
    // }

    space_afterInfected[i] = {
      S: now.S + diff.S,
      I: now.I + diff.I,
      R: now.R + diff.R,
    };

    // if (
    //   space_afterInfected[i].S < 0 ||
    //   space_afterInfected[i].I < 0 ||
    //   space_afterInfected[i].R < 0
    // ) {
    //   console.log(i);
    //   console.log(space_afterInfected[i]);
    //   throw new Error("invalid value calculation result.");
    // }

    diff_logArray[i] = { ...diff };
  }

  return space_afterInfected;
  // return [space_afterInfected, diff_logArray];
};

module.exports = { generateNewPeopleDist, simulateInfection };

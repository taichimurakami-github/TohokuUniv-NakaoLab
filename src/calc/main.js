
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
      else {
        // (i_from === 0 && i_to === 1) && console.log("test", newSpace[i_from], newSpace[i_to], outflow);
        const outflow = Math.floor(coeffMatrix[i_from][i_to] * newSpace[i_from]);
        diff[i_from].minus += outflow;
        diff[i_to].plus += outflow;
        // (i_from === 0 && i_to === 1) && console.log("test2", newSpace[i_from], newSpace[i_to], outflow);
      }

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


module.exports = { generateNewPeopleDist };
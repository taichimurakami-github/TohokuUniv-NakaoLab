class PeopleStateTransition {
  constructor(p) {
    this.calcByPhaseLoop(p);
  }

  calcByPhaseLoop(People) {
    //最初のSは特殊遷移（S -> Iのパターンのみ）なので、除外
    //最後のRは遷移先が存在しない（あとでフィードバックは追加するかも）ので、Rに関する計算は除外
    for (let i = 1; i < People.nodeTree.length; i++) {
      const layer_prev = People.state[i - 1];
      const layer_this = People.state[i];

      /**
       * 計算(1)
       * phase同士の遷移：previousLayer.NI -> thisLayer.I
       */
      for (const prevNode of layer_prev) {
        const NI_prev = prevNode.NI;
        for (const thisNode of layer_this) {
          for (const I_this of Object.values(thisNode.I)) {
            //(遷移元のNIのimmunizedType) === (遷移先のIのimmunizedType) かつ
            //遷移先のIのstrainTypeが遷移元のimmunizedTypeに含まれていない
            //    >> NI -> I への遷移発生
            if (
              !NI_prev.immunizedType.includes(I_this.strainType) &&
              this.isArraySame(NI_prev.immunizedType, I_this.immunizedType)
            ) {
              const rate_I = People.sum.I[I_this.strainType] / People.sum.ALL;
              const diff = NI_prev.p * I_this.beta * rate_I;

              // if (rate_I > 1) {
              //   console.log("\n NI -> I diff=", diff);
              //   throw new Error("diff overflow.");
              // }

              NI_prev.diff -= diff;
              I_this.diff += diff;
            }
          }
        }
      }
      /**
       * 計算(2)
       * phase内の遷移：thisLayer.I -> thisLayer.NI
       */
      for (const thisNode of layer_this) {
        const NI_this = thisNode.NI;
        //各I -> 各NIにそのまま遷移
        //Iは複数のstrainTypeを含んでいる可能性があるので、forループですべて処理しておく
        for (const I_this of Object.values(thisNode.I)) {
          const diff = I_this.p * I_this.gamma;
          I_this.diff -= diff;
          NI_this.diff += diff;
        }
      }
    }
  }

  getTransitionTargetOfNI(I_from, layer_next) {}

  isArrayComprehensive(parent, children) {
    for (const val of children) {
      //childrenの要素が1つでもparentに含まれていなければOUT -> return false
      if (!parent.includes(val)) return false;
    }
    return true;
  }

  isArraySame(arr1, arr2) {
    for (const val of arr1) {
      //arr1の要素がarr2に含まれていない時点でOUT -> return false
      if (!arr2.includes(val)) return false;
    }
    return true;
  }
}

module.exports = { PeopleStateTransition };

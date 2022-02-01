class PeopleStateTransition {
  constructor(SpaceModel) {
    const s = SpaceModel;
    const v = SpaceModel.VirusModel;
    this.feedbackRate = s.config.params.feedbackRate;

    for (const state of s.state) {
      this.calcByPhaseLoop(state.people, v);
    }
  }

  calcByPhaseLoop(People, Virus) {
    //最初のSは特殊遷移（S -> Iのパターンのみ）なので、除外
    //最後のRは遷移先が存在しない（あとでフィードバックは追加するかも）ので、Rに関する計算は除外
    for (let i = 1; i < People.nodeTree.length; i++) {
      const layer_prev = People.state[i - 1];
      const layer_this = People.state[i];

      /**
       * 計算(1)
       * phase同士の遷移：previousLayer.NI -> thisLayer.I
       * + 免疫を持っていないウイルス株への感染
       * + 免疫を持っているウイルス株への再感染
       */
      this.calcInfection(layer_prev, layer_this, People, Virus);

      /**
       * 計算(2)
       * phase内の遷移：thisLayer.I -> thisLayer.NI
       * + 感染しているウイルス株からの回復
       * + 再感染しているウイルス株からの回復
       */
      this.calcRecover(layer_this);

      /**
       * 計算(3)
       * フィードバックの計算
       */
      this.calcFeedback(layer_prev, layer_this);
    }
  }

  calcInfection(layer_prev, layer_this, People, VirusModel) {
    for (const prevNode of layer_prev) {
      const NI_prev = prevNode.NI;
      for (const thisNode of layer_this) {
        //感染経験のないウイルス株に対する感染
        for (const I_this of Object.values(thisNode.I)) {
          /**
           * 1. 遷移先のIのstrainTypeが遷移元のimmunizedTypeに含まれていない
           * 2. (遷移元のNIのimmunizedType) === (遷移先のIのimmunizedType)
           * 1,2が同時成立 >> NI -> I への遷移発生
           */
          if (
            !NI_prev.immunizedType.includes(I_this.strainType) &&
            this.isArraySame(NI_prev.immunizedType, I_this.immunizedType)
          ) {
            //該当するウイルス株に感染している人の割合の定義
            const rate_I = People.sum.I[I_this.strainType] / People.sum.ALL;

            //交差免疫反応を考慮した感染力の生成
            const beta = I_this.getBeta("infected", VirusModel);

            //計算
            const diff = NI_prev.p * beta * rate_I;

            //記録
            NI_prev.diff -= diff;
            I_this.diff += diff;
          }
        }

        //感染経験のあるウイルス株に対する再感染
        const NI_this = thisNode.NI;
        for (const RI_this of Object.values(thisNode.RI)) {
          //該当するウイルス株に感染している人の割合の定義
          const rate_RI = People.sum.I[RI_this.strainType] / People.sum.ALL;

          //交差免疫反応を考慮した感染力の生成
          const beta = RI_this.getBeta("reinfected", VirusModel);

          //計算
          const diff = NI_prev.p * beta * rate_RI;

          //記録
          NI_this.diff -= diff;
          RI_this.diff += diff;
        }
      }
    }
  }

  calcRecover(layer_this) {
    for (const thisNode of layer_this) {
      const NI_this = thisNode.NI;
      //各I -> 各NIにそのまま遷移
      //Iは複数のstrainTypeをキーとして含んでいる可能性があるので、forループですべて処理しておく
      for (const I_this of Object.values(thisNode.I)) {
        const diff = I_this.p * I_this.getGamma();
        I_this.diff -= diff;
        NI_this.diff += diff;
      }

      //各I -> 各NIにそのまま遷移
      //Iは複数のstrainTypeをキーとして含んでいる可能性があるので、forループですべて処理しておく
      for (const RI_this of Object.values(thisNode.RI)) {
        const diff = RI_this.p * RI_this.getGamma();
        RI_this.diff -= diff;
        NI_this.diff += diff;
      }
    }
  }

  calcFeedback(layer_prev, layer_this) {
    //フィードバック率が0であれば計算を破棄（リソース節約）
    if (this.feedbackRate === 0) return;

    for (const thisNode of layer_this) {
      const NI_this = thisNode.NI;
      const feedbackTargets = [];

      //まだNI_thisに遷移されていない場合は探索終了
      if (NI_this.p === 0) continue;

      //下層レイヤーのNIクラスの持つ免疫タイプのうち、一つ以上の免疫状態を保持している上層レイヤーのNIクラスへの遷移を行う
      //遷移先となるNIクラスを配列上に保持する
      for (const prevNode of layer_prev) {
        const NI_prev = prevNode.NI;

        this.isArrayComprehensive(
          NI_this.immunizedType,
          NI_prev.immunizedType
        ) && feedbackTargets.push(NI_prev);
      }

      //記録したfeedbackTargetsに対して、フィードバックを計算
      //とりあえず、均等に戻るものとする
      for (const NI_prev of feedbackTargets) {
        const diff = this.feedbackRate * NI_this.p;
        NI_this.diff -= diff;
        NI_prev.diff += diff;
      }
    }
  }

  /**
   * Utility Function (1)
   * isArrayComprehensive
   *
   * 第一引数の配列同士が第二引数の配列の要素をすべて保持しているかを判定
   *
   * @param {Array} parent
   * @param {Array} children
   * @returns
   */
  isArrayComprehensive(parent, children) {
    for (const val of children) {
      //childrenの要素が1つでもparentに含まれていなければOUT -> return false
      if (!parent.includes(val)) return false;
    }
    return true;
  }

  /**
   * Utility Function (2)
   * isArrayComprehensive
   *
   * 引数の配列同士の間で、要素の包括関係があるかを判定
   *
   * @param {Array} parent
   * @param {Array} children
   * @returns
   */
  isArraySame(arr1, arr2) {
    for (const val of arr1) {
      //arr1の要素がarr2に含まれていない時点でOUT -> return false
      if (!arr2.includes(val)) return false;
    }
    return true;
  }
}

module.exports = { PeopleStateTransition };

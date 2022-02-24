import { Config } from "../Config/Config";
import { People, StateNode } from "../People/People";
import { Space, type_SpaceState, type_VaccineLog } from "../Space/Space";

export class PeopleStateTransition {
  private EI_transCoeff: number;

  constructor(SpaceModel: Space) {
    const s = SpaceModel;
    const c = s.Config;
    // this.EI_transCoeff = s.Config.getEI_transCoeff();
    this.EI_transCoeff = 0.4;

    for (const state of s.state) {
      this.calcByPhaseLoop(state, c);
    }
  }

  calcByPhaseLoop(type_SpaceState: type_SpaceState, Config: Config) {
    const PeopleModel = type_SpaceState.people;
    const VaccineLog = type_SpaceState.vaccinated;

    //最初のSは特殊遷移（S -> Iのパターンのみ）なので、除外
    //最後のRは遷移先が存在しない（あとでフィードバックは追加するかも）ので、Rに関する計算は除外
    for (let i = 1; i < PeopleModel.nodeTree.length; i++) {
      const layer_prev = PeopleModel.state[i - 1];
      const layer_this = PeopleModel.state[i];

      /**
       * 計算(1)
       * 1. phase同士の遷移：previousLayer.NI -> thisLayer.E
       * + 免疫を持っていないウイルス株への感染
       * + 免疫を持っているウイルス株への再感染
       *
       * 2. phase内のE -> Iへの遷移
       */
      this.calcInfection(
        layer_prev,
        layer_this,
        PeopleModel,
        VaccineLog,
        Config
      );

      /**
       * 計算(2)
       * phase内の遷移：thisLayer.I -> thisLayer.NI
       * + 感染しているウイルス株からの回復
       * + 再感染しているウイルス株からの回復
       */
      this.calcRecover(layer_this, Config);

      /**
       * 計算(3)
       * フィードバックの計算
       */
      this.calcFeedback(layer_prev, layer_this, Config.getFeedbackRate());
    }
  }

  calcInfection(
    layer_prev: StateNode[],
    layer_this: StateNode[],
    PeopleModel: People,
    VaccineLog: type_VaccineLog,
    Config: Config
  ) {
    for (const prevNode of layer_prev) {
      const NI_prev = prevNode.NI;
      for (const thisNode of layer_this) {
        //感染経験のないウイルス株に対する感染
        for (const strainType of Object.keys(thisNode.E)) {
          const E_this = thisNode.E[strainType];
          const I_this = thisNode.I[strainType];
          /**
           * E -> Iへの遷移
           */
          //計算
          const diff_E_to_I = E_this.p * this.EI_transCoeff;

          //記録
          E_this.diff -= diff_E_to_I;
          I_this.diff += diff_E_to_I;

          /**
           * 1. 遷移先のIのstrainTypeが遷移元のimmunizedTypeに含まれていない
           * 2. (遷移元のNIのimmunizedType) === (遷移先のIのimmunizedType)
           * 1,2が同時成立 >> NI -> I への遷移発生
           */
          if (
            !NI_prev.immunizedType.includes(E_this.strainType) &&
            this.isArraySame(NI_prev.immunizedType, E_this.immunizedType)
          ) {
            //該当するウイルス株に感染している人の割合の定義
            const rate_I = PeopleModel.getInfectedRate(strainType);

            //交差免疫反応を考慮した感染力の生成
            const beta = E_this.getBeta(VaccineLog, Config);

            //計算
            const diff_NI_to_E = NI_prev.p * beta * rate_I;

            //記録
            NI_prev.diff -= diff_NI_to_E;
            E_this.diff += diff_NI_to_E;
          }
        }

        //感染経験のあるウイルス株に対する再感染
        const NI_this = thisNode.NI;
        for (const strainType of Object.keys(thisNode.R_E)) {
          const RE_this = thisNode.R_E[strainType];
          const RI_this = thisNode.R_I[strainType];

          //E -> Iへの遷移
          const diff_RE_to_RI = RE_this.p * this.EI_transCoeff;
          RE_this.p -= diff_RE_to_RI;
          RI_this.p += diff_RE_to_RI;

          //該当するウイルス株に感染している人の割合の定義
          const rate_I = PeopleModel.getInfectedRate(strainType);

          //交差免疫反応を考慮した感染力の生成
          const beta = RE_this.getBeta(VaccineLog, Config);

          //計算
          const diff = NI_prev.p * beta * rate_I;

          //記録
          NI_this.diff -= diff;
          RE_this.diff += diff;
        }
      }
    }
  }

  calcRecover(layer_this: StateNode[], Config: Config) {
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
      for (const RI_this of Object.values(thisNode.R_I)) {
        const diff = RI_this.p * RI_this.getGamma();
        RI_this.diff -= diff;
        NI_this.diff += diff;
      }
    }
  }

  calcFeedback(
    layer_prev: StateNode[],
    layer_this: StateNode[],
    feedbackRate: number
  ) {
    //フィードバック率が0であれば計算を破棄（リソース節約）
    if (feedbackRate === 0) return;

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
        const diff = feedbackRate * NI_this.p;
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
  isArrayComprehensive(parent: any[], children: any[]) {
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
  isArraySame(arr1: any[], arr2: any[]) {
    for (const val of arr1) {
      //arr1の要素がarr2に含まれていない時点でOUT -> return false
      if (!arr2.includes(val)) return false;
    }
    return true;
  }
}

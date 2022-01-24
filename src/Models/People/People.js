const { calcCombination, getRandomFloat } = require("../../calc/lib");
const { I } = require("./Infected");
const { NI } = require("./NotInfected");

/**
 * class People
 *
 * <class property>
 * + state
 * + nodeTree
 * + config
 * + t
 *
 * <class function>
 */
class People {
  constructor(config, VirusModel) {
    this.state = [];
    this.result = [];
    this.config = config;
    this.t = 0;
    this.VirusModel = VirusModel;

    /**
     * sumを計算
     */
    this.sum = this.getInitializedSumTemplate();

    /**
     * レイヤー作成アルゴリズム
     * nodeTreeStructureを計算
     */
    this.nodeTree = this.getLayeredStrainTypesNodeTree();

    /**
     * 作成されたレイヤーを基にPeopleStateを生成
     */
    //レイヤー内の各ノードにしたがって、計算で使用するNI, Iクラスを自動で作成
    for (let i = 0; i < this.nodeTree.length; i++) {
      //レイヤーを生成
      this.state[i] = [];

      /**
       * レイヤーの中身を作成
       * 渡されたnode毎に、NIとIを作成
       *
       * nodeの構造は以下の通り
       * ex1) node = ["StrainType1", "StrainType2", "StrainType3"]
       * ex2) node = [["M1","M2"], ["M2","M3"], ["M3", "M1"]]
       */
      for (const node of this.nodeTree[i]) {
        //各レイヤーのテンプレート生成
        const template = { NI: null, RI: {}, I: {} };
        /**
         * 各ノードには、一つの回復者NIが対応
         * ex: node = ["E","M1","M2"]の場合
         * (1) R(immunized E, M1, M2)
         * のみ生成
         */
        template.NI = new NI({
          p: 0,
          mu: 0,
          immunizedType: node,
        });

        /**
         * 各ノードには、ウイルス株の個数に応じて複数のIが対応
         * ex: node = ["E","M1","M2"]の場合
         * + I_E(immunized M1, M2)
         * + I_M1(immunized E, M2)
         * + I_M2(immunized E, M1)
         *
         * また、再感染に対応するノードも生成
         * + I_E(immunized E, M1), I_E(immunized E, M2)
         * + I_M1(immunized E, M1), I_E(immunized M1, M2)
         * + I_M2(immunized E, M2), I_E(immunized M1, M2)
         */
        for (const strainType of node) {
          //nodeから要素１つを除外した配列を用意
          const I_immunizedType = node.filter((val) => val !== strainType);

          //新規ウイルス株に対する感染クラス（I）を生成
          //I_immunizedTypeを獲得済み免疫として設定
          //除外されたstrainTypeを感染先のウイルス株と認定
          template.I[strainType] = new I({
            p: 0,
            immunizedType: I_immunizedType,
            config: VirusModel.getStrainConfig(strainType),
          });

          //感染済みウイルス株に対する感染クラス（RI）を生成
          //immunizedType:
          template.RI[strainType] = new I({
            p: 0,
            immunizedType: node,
            config: VirusModel.getStrainConfig(strainType),
            reinfected: true,
          });
        }

        //テンプレートに従ってノードを生成
        this.state[i].push(template);
      }
    }

    //S（免疫を保持しない原点ノード）生成
    this.state[0].push({
      NI: new NI({
        p: Math.floor(
          // 初期人口：0.01 ~ 1.0 * max_const
          getRandomFloat(0.1, 1.0) * this.config.params.maxPopulationSize
        ),
        mu: 0,
        immunizedType: [],
      }),
      I: {},
      RI: {},
    });

    //初期状態を記録
    this.recordResult();
    this.getSum();
  }

  updateWithCycleStart() {
    //時間を進める
    this.t += 1;

    //イベント実行後のsumを求める -> 計算にて使用
    this.getSum();
    return;
  }

  updateWithCycleEnd() {
    this.applyDiffOfAllState();
    this.recordResult();
  }

  getInitializedSumTemplate() {
    const initialTemp = {
      NI: 0,
      ALL: 0,
      S: 0,
      I: {},
      R: 0,
    };

    //ウイルス株を解析し、Iのpropertyを生成
    for (const strainType of this.VirusModel.strainTypesArr)
      initialTemp.I[strainType] = 0;

    return initialTemp;
  }

  getLayeredStrainTypesNodeTree() {
    //ノードになる基底状態を自動生成
    const modelStructure = [[]];
    for (let i = 0; i < this.VirusModel.strainTypesArr.length; i++) {
      modelStructure.push(
        calcCombination(this.VirusModel.strainTypesArr, i + 1)
      );
    }
    return modelStructure;
  }

  getSum() {
    const tmp = this.getInitializedSumTemplate();
    for (const layer of this.state) {
      for (const node of layer) {
        //layer内のNIを算出
        tmp.NI += node.NI.p;
        tmp.ALL += node.NI.p;

        //NIのうち、SとRを分離してそれぞれ合計を記録
        if (node.NI.immunizedType.length === 0) tmp.S += node.NI.p;
        else tmp.R += node.NI.p;

        //layer内のIを算出
        for (const I of Object.values(node.I)) {
          tmp.I[I.strainType] += I.p;
          tmp.ALL += I.p;
        }

        //layer内のRIを算出
        for (const RI of Object.values(node.RI)) {
          //再感染者もIクラスで保持するので、Iクラスの合計として算出する
          tmp.I[RI.strainType] += RI.p;
          tmp.ALL += RI.p;
        }
      }
    }

    return (this.sum = { ...tmp });
  }

  applyDiffOfAllState() {
    for (const layer of this.state) {
      for (const node of layer) {
        //layer内のNI探索
        node.NI.applyDiff();

        //layer内のI探索
        for (const I of Object.values(node.I)) I.applyDiff();

        //layer内のRI探索
        for (const RI of Object.values(node.RI)) RI.applyDiff();
      }
    }
  }

  recordResult() {
    return this.result.push(this.getSum());
  }
}

module.exports = { People };

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
     * nodeTreeStructureを計算
     */
    this.nodeTree = this.getLayeredNodeTree();

    /**
     * PeopleStateを生成
     */
    //レイヤー内の各ノードにしたがって、計算で使用するNI, Iクラスを自動で作成
    for (let i = 0; i < this.nodeTree.length; i++) {
      //各ノードのidと１対１で対応するように出力
      this.state[i] = [];
      for (const node of this.nodeTree[i]) {
        const template = { I: {}, NI: null };
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
         * (1) I_E(immunized M1, M2)
         * (2) I_M1(immunized E, M2)
         * (3) I_M2(immunized E, M1)
         */
        for (const strainType of node) {
          const I_immunizedType = node.filter((val) => val !== strainType);
          template.I[strainType] = new I({
            p: 0,
            immunizedType: I_immunizedType,
            config: VirusModel.getStrainConfig(strainType),
          });
        }
        this.state[i].push(template);
      }
    }

    //S生成
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
    });

    //初期状態を記録
    this.recordResult();
    this.getSum();
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

  getLayeredNodeTree() {
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
      }
    }
  }

  recordResult() {
    return this.result.push(this.getSum());
  }
}

module.exports = { People };

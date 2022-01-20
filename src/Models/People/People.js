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

    const strainTypesArr = VirusModel.getStrainTypesArr();

    /**
     * sumを計算
     */
    this.sum = {
      NI: 0,
      All: 0,
      S: 0,
      I: {},
      R: 0,
    };
    for (const strainType of strainTypesArr) this.sum.I[strainType] = 0;

    /**
     * nodeTreeStructureを計算
     */
    this.nodeTree = this.getLayeredNodeTree(strainTypesArr);

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
            mu: 0,
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

  updateWithCycleStart(VirusModel) {
    switch (this.t) {
      case 0: {
        //Iの初期人口生成 = 最初の感染者群発生
        const firstStrainType =
          VirusModel.getStrainConfig("_INITIAL_STRAIN_").strainType;
        this.state[1][0].I[firstStrainType].p =
          this.state[0][0].NI.p * this.config.params.initialInfectiousRate;
        break;
      }
      default:
        break;
    }

    //イベント実行後のsumを求める -> 計算にて使用
    this.getSum();
    return;
  }

  updateWithCycleEnd() {
    this.applyDiffOfAllState();
    this.recordResult();
  }

  getLayeredNodeTree(strainTypesArr) {
    //ノードになる基底状態を自動生成
    const r = [[]];
    for (let i = 0; i < strainTypesArr.length; i++) {
      r.push(calcCombination(strainTypesArr, i + 1));
    }
    console.log("\nModel Structure:\n");
    console.log(r);
    console.log("\n\n");
    return r;
  }

  getSum() {
    for (const layer of this.state) {
      for (const node of layer) {
        //layer内のNIを算出
        this.sum.NI += node.NI.p;
        this.all += node.NI.p;

        //NIのうち、SとRを分離してそれぞれ合計を記録
        if (node.NI.immunizedType.length === 0) this.S += node.NI.p;
        else this.R += node.NI.p;

        //layer内のIを算出
        for (const I of Object.values(node.I)) {
          this.sum.I[I.strainType] += I.p;
          this.all += I.p;
        }
      }
    }
  }

  applyDiffOfAllState() {
    for (const layer of this.state) {
      for (const node of layer) {
        //layer内のNI
        node.NI.applyDiff();
        //layer内のI
        for (const I of Object.values(node.I)) {
          I.applyDiff();
        }
      }
    }
  }

  recordResult() {
    const recordTemplate = {
      S: 0,
      I: 0,
      R: 0,
    };
    for (const layer of this.state) {
      for (const node of layer) {
        //node === Sの場合
        if (node.NI.immunizedType.length === 0) recordTemplate.S += node.NI.p;
        else {
          //Rを記録
          recordTemplate.R += node.NI.p;

          //Iを記録
          for (const I of Object.values(node.I)) recordTemplate.I += I.p;
        }
      }
    }
    this.result.push(recordTemplate);
  }
}

module.exports = { People };

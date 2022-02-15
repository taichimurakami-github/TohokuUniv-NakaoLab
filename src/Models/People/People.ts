import { calcCombination, getRandomFloat } from "../../lib";
import { Virus } from "../Virus/Virus";
import { I, E } from "./Infected";
import { NI } from "./NotInfected";

//layerdNode構造用 型定義
/**
 * [
 *     ↓ Node
 *  [ [] [] [] ...], <- Layer
 *  [ [] [] [] ...],
 *  ...
 * ] <- NodeTree
 */
export type LayerStructure<T> = T[][];
export type NodeTreeStructure<T> = LayerStructure<T>[];

//state生成用 型定義
//NodeTreeのLayerをStateNodeで置き換える
/**
 * [
 *   { StateNode } , <- Layer
 *   { StateNode } ,
 *  ...
 * ] <- LayeredStructure
 */
export type InstanceListPerStrainTypes<T> = {
  [strainType: string]: T;
};

export type StateNode = {
  E: InstanceListPerStrainTypes<E>;
  I: InstanceListPerStrainTypes<I>;
  NI: NI;
  R_E: InstanceListPerStrainTypes<E>;
  R_I: InstanceListPerStrainTypes<I>;
};
export type PeopleStateNodeTree = LayerStructure<StateNode>;

//sum計算用template型宣言
export type PeopleSumTemplate = {
  NI: number;
  ALL: number;
  S: number;
  E: {
    [strainType: string]: number;
  };
  I: {
    [strainType: string]: number;
  };
  R: number;
};

//resultの構造を型宣言
export type PeopleResult = PeopleSumTemplate[];

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
export class People {
  public state: PeopleStateNodeTree;
  public result: PeopleResult;
  public config: any;
  public t: number;
  public VirusModel: Virus;
  public sum: any;
  public nodeTree: NodeTreeStructure<string>;

  constructor(config: any, VirusModel: Virus) {
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
     * レイヤー内の各ノードにしたがって、計算で使用するNI, Iクラスを自動で作成する
     */

    //S（免疫を保持しない原点ノード）生成
    const initialPopulation = Math.floor(
      // 初期人口：0.01 ~ 1.0 * max_const
      getRandomFloat(0.1, 1.0) * this.config.params.maxPopulationSize
    );
    this.state[0] = [
      {
        NI: new NI(
          {
            immunizedType: [],
            config: this.config,
          },
          initialPopulation
        ),
        I: {},
        E: {},
        R_I: {},
        R_E: {},
      },
    ];

    for (let i = 1; i < this.nodeTree.length; i++) {
      //レイヤーを生成
      this.state.push([]);

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
        const template: any = {
          NI: new NI({
            immunizedType: node,
            config: this.config,
          }),
          E: {},
          I: {},
          R_E: {},
          R_I: {},
        };
        /**
         * 各ノードには、一つの回復者NIが対応
         * ex: node = ["E","M1","M2"]の場合
         * (1) R(immunized E, M1, M2)
         * のみ生成
         */

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
          const I_immunizedType = node.filter(
            (val: string) => val !== strainType
          );

          //新規ウイルス株に対する感染クラス（I）を生成
          //I_immunizedTypeを獲得済み免疫として設定
          //除外されたstrainTypeを感染先のウイルス株と認定
          template.I[strainType] = new I({
            immunizedType: I_immunizedType,
            VirusConfig: VirusModel.getStrainConfig(strainType),
          });

          //感染済みウイルス株に対する感染クラス（RI）を生成
          //immunizedType:
          template.R_I[strainType] = new I({
            immunizedType: node,
            VirusConfig: VirusModel.getStrainConfig(strainType),
            reinfected: true,
          });
          template.R_E[strainType] = new E({
            immunizedType: node,
            VirusConfig: VirusModel.getStrainConfig(strainType),
            reinfected: true,
          });
        }
        //テンプレートに従ってノードを生成
        this.state[i].push(template);
      }
    }

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
    //計算結果を適用したのち、死亡数を計算して適用する
    for (const layer of this.state) {
      for (const node of layer) {
        //layer内のNI探索 & 死亡と出生の反映
        node.NI.applyDiff();
        node.NI.applyBirthAndDeath();

        //layer内のI探索 & 感染による死亡の反映
        for (const strainType of Object.keys(node.E)) {
          node.E[strainType].applyDiff();
          node.E[strainType].applyDeathByInfection();
          node.I[strainType].applyDiff();
          node.I[strainType].applyDeathByInfection();
        }

        //layer内のRI探索 & 感染による死亡の反映
        for (const strainType of Object.keys(node.R_E)) {
          node.R_I[strainType].applyDiff();
          node.R_E[strainType].applyDeathByInfection();
        }
      }
    }
    this.recordResult();
  }

  getInfectedRate(strainType: string) {
    const infected_sum = this.sum.I[strainType] + this.sum.E[strainType];
    const all = this.sum.ALL;
    return infected_sum / all;
  }

  getInitializedSumTemplate() {
    const initialTemp: PeopleSumTemplate = {
      NI: 0,
      ALL: 0,
      S: 0,
      E: { ALL: 0 },
      I: { ALL: 0 },
      R: 0,
    };

    //ウイルス株を解析し、Iのpropertyを生成
    for (const strainType of this.VirusModel.strainTypesArr)
      initialTemp.I[strainType] = 0;

    return initialTemp;
  }

  getLayeredStrainTypesNodeTree() {
    //ノードになる基底状態を自動生成
    const modelStructure: NodeTreeStructure<string> = [[]];
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

        //layer内の新規感染系統を算出
        for (const strainType of Object.keys(node.E)) {
          //E状態の人数を計算
          tmp.E[strainType] += node.E[strainType].p;
          tmp.ALL += node.E[strainType].p;
          tmp.E.ALL += node.E[strainType].p;

          //I状態の人数を計算
          tmp.I[strainType] += node.I[strainType].p;
          tmp.ALL += node.I[strainType].p;
          tmp.I.ALL += node.I[strainType].p;
        }

        //layer内の再感染系統を算出
        for (const strainType of Object.keys(node.R_E)) {
          //再感染者もIクラスで保持するので、Iクラスの合計として算出する
          //E状態の人数を計算
          tmp.E[strainType] += node.R_E[strainType].p;
          tmp.ALL += node.R_E[strainType].p;
          tmp.E.ALL += node.R_E[strainType].p;

          //I状態の人数を計算
          tmp.I[strainType] += node.R_I[strainType].p;
          tmp.ALL += node.R_I[strainType].p;
          tmp.I.ALL += node.R_I[strainType].p;
        }
      }
    }

    return (this.sum = { ...tmp });
  }

  recordResult() {
    return this.result.push(this.getSum());
  }
}

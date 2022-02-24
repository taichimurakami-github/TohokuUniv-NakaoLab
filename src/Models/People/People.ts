import { calcCombination, getRandomFloat } from "../../lib";
import { Config } from "../Config/Config";
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
export type type_LayerStructure<T> = T[][];
export type type_NodeTreeStructure<T> = type_LayerStructure<T>[];

//state生成用 型定義
//NodeTreeのLayerをStateNodeで置き換える
/**
 * [
 *   { StateNode } , <- Layer
 *   { StateNode } ,
 *  ...
 * ] <- LayeredStructure
 */
export type type_InstanceListPerStrainTypes<T> = {
  [strainType: string]: T;
};

export type StateNode = {
  E: type_InstanceListPerStrainTypes<E>;
  I: type_InstanceListPerStrainTypes<I>;
  NI: NI;
  R_E: type_InstanceListPerStrainTypes<E>;
  R_I: type_InstanceListPerStrainTypes<I>;
};
export type type_PeopleStateNodeTree = type_LayerStructure<StateNode>;

//sum計算用template型宣言
export type type_PeopleSumTemplate = {
  NI: number;
  ALL: number;
  S: number;
  E: { [strainType: string]: number };
  I: { [strainType: string]: number };
  R: number;
};

//resultの構造を型宣言
export type type_PeopleResult = type_PeopleSumTemplate[];

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
  public state: type_PeopleStateNodeTree;
  public result: type_PeopleResult;
  public Config: Config;
  public t: number;
  public sum: any;
  public nodeTree: type_NodeTreeStructure<string>;

  constructor(config: Config) {
    this.state = [];
    this.result = [];
    this.Config = config;
    this.t = 0;

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

    const i_pop_max = config.getInitialPopulation().max;
    const i_pop_min = config.getInitialPopulation().min;

    //S（免疫を保持しない原点ノード）生成
    const initialPopulation = Math.floor(
      // 初期人口：config i_pop_min ~ i_pop_max * max_const
      getRandomFloat(i_pop_min, i_pop_max) * this.Config.getMaxPopulationSize()
    );
    this.state[0] = [
      {
        NI: new NI(
          {
            immunizedType: [],
            config: this.Config.getAllConfig(),
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
            config: this.Config.getAllConfig(),
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
          template.E[strainType] = new I({
            strainType: strainType,
            immunizedType: I_immunizedType,
            Config: config,
            reinfected: false,
          });
          template.I[strainType] = new I({
            strainType: strainType,
            immunizedType: I_immunizedType,
            Config: config,
            reinfected: false,
          });

          //感染済みウイルス株に対する感染クラス（RI）を生成
          //immunizedType:
          template.R_E[strainType] = new E({
            strainType: strainType,
            immunizedType: node,
            Config: config,
            reinfected: true,
          });
          template.R_I[strainType] = new I({
            strainType: strainType,
            immunizedType: node,
            Config: config,
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
    const initialTemp: type_PeopleSumTemplate = {
      NI: 0,
      ALL: 0,
      S: 0,
      E: { ALL: 0 },
      I: { ALL: 0 },
      R: 0,
    };

    //ウイルス株を解析し、Iのpropertyを生成
    for (const strainType of this.Config.getStrainTypesArray()) {
      initialTemp.I[strainType] = 0;
      initialTemp.E[strainType] = 0;
    }

    return initialTemp;
  }

  getLayeredStrainTypesNodeTree() {
    const strainTypesArr = this.Config.getStrainTypesArray();
    //ノードになる基底状態を自動生成
    const modelStructure: type_NodeTreeStructure<string> = [[]];
    for (let i = 0; i < strainTypesArr.length; i++) {
      modelStructure.push(calcCombination(strainTypesArr, i + 1));
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

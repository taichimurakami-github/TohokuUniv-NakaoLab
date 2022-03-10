import { type_AllConfig, type_VaccineEffects } from "../../../@types/config";
import { Config } from "../Config/Config";
import { PeopleStateTransition } from "../LifeCycleEvents/PeopleStateTransition";
import { PeopleTravel } from "../LifeCycleEvents/PeopleTravel";
import { PeopleVaccination } from "../LifeCycleEvents/PeopleVaccination";
import { VirusMutation } from "../LifeCycleEvents/VirusMutation";
import { People, type_PeopleSumTemplate } from "../People/People";

export type type_ModelResult = type_PeopleSumTemplate[][];

export type type_VaccineLog = {
  [vaccineName: string]: {
    vaccinatedAt: number; //ワクチン接種日
    attenuationCoeff: number; //ワクチン接種からの時間経過による効果減少度
    effect: type_VaccineEffects;
  };
};

export type type_SpaceState = {
  people: People;
  vaccinated: type_VaccineLog;
};

export type type_ModelResultTemplate = {
  config: type_AllConfig;
  axisNames: string[];
  data: number[][][];
  newInfectious: number[][];
};

/**
 * 空間を定義し、管理する
 * インスタンス生成時に空間作成を自動で行う
 */

export class Space {
  public state: type_SpaceState[];
  public mvCoeff: number[][];
  public result: type_ModelResult;
  public t: number;
  public Config: Config;

  constructor(config: Config) {
    this.state = [];
    this.mvCoeff = [];
    this.result = [];
    this.t = 0;
    this.Config = config;

    //空間内のウイルスを定義

    //ワクチンモデルを起動

    //Peopleインスタンスを空間の個数分生成
    const row = config.getSpaceLength().row;
    const col = config.getSpaceLength().col;
    for (let i = 0; i < row * col; i++) {
      //初期状態を定義
      //各空間に属するインスタンスを作成
      this.state.push({
        people: new People(config),
        vaccinated: {},
      });
    }
  }

  updateWithLifeCycle() {
    //時間を進める
    this.t += 1;

    //人流移動を実行
    new PeopleTravel(this);

    //ワクチン接種を実行
    new PeopleVaccination(this);

    //ウイルス変異を実行
    new VirusMutation(this);

    //Peopleインスタンスで定義されたイベント開始
    for (const state of this.state) state.people.updateWithCycleStart();

    //空間内での基底状態間の遷移
    new PeopleStateTransition(this);

    //Peopleインスタンスで定義されたイベント開始
    //1. 計算結果を反映
    //2. 該当インスタンスの死亡率を算出して適用
    //3. ライフサイクルの最終計算結果を記録
    for (const state of this.state)
      state.people.updateWithCycleEnd(state.vaccinated);
  }

  /**
   * 各spaceごとのPeople.resultを返す
   * -----------------------------------
   * + return structure:
   *  [
   *    <Parent Array ID = Space.state ID>
   *    {
   *      <Each Element has results of each Space.state>
   *       asObject : People.result.ArrayOfObj : formatted result as Array of Object
   *       asArray : People.result.ArrayOfPop : only population result as Array of Array
   *    },
   *    {
   *      ...
   *    }
   *  ]
   * -----------------------------------
   * @returns {[{[String]: Array}]}
   */
  getResults() {
    const result: type_ModelResultTemplate = {
      config: { ...this.Config.getAllConfig() },
      axisNames: ["S", "R"],
      data: [],
      newInfectious: [],
    };

    //axisNames(label)を設定
    const E_sum_temp = this.state[0].people.getInitializedSumTemplate().E;
    for (const strainTypes of Object.keys(E_sum_temp)) {
      result.axisNames.push(`E_${strainTypes}`);
      result.axisNames.push(`I_${strainTypes}`);
    }

    for (const type_SpaceState of this.state) {
      //Space.stateの各Peopleに対して計算
      const p = type_SpaceState.people;
      const this_p_result = [];

      //各Peopleのtype_ModelResultTemplateを計算
      for (const r of p.result) {
        const tmp: number[] = [];
        tmp.push(r.S);
        tmp.push(r.R);

        //register E, I
        for (const strainType of Object.keys(r.E)) {
          tmp.push(r.E[strainType]);
          tmp.push(r.I[strainType]);
        }

        this_p_result.push(tmp);
      }

      //結果を記録
      result.data.push(this_p_result);

      //新規感染者数を記録
      result.newInfectious.push(p.newInfectiousLog);
    }

    return result;
  }
}

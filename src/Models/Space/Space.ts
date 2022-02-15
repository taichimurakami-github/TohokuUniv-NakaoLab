import { PeopleStateTransition } from "../LifeCycleEvents/PeopleStateTransition";
import { PeopleTravel } from "../LifeCycleEvents/PeopleTravel";
import { VirusMutation } from "../LifeCycleEvents/VirusMutation";
import { People, PeopleSumTemplate } from "../People/People";
import { Virus } from "../Virus/Virus";

export type SpaceResult = PeopleSumTemplate[][];

export type SpaceState = {
  people: People;
}[];

/**
 * 空間を定義し、管理する
 * インスタンス生成時に空間作成を自動で行う
 */

export class Space {
  public state: SpaceState;
  public mvCoeff: number[][];
  public result: SpaceResult;
  public t: number;
  public config: any;
  public VirusModel: Virus;

  constructor(config: any) {
    this.state = [];
    this.mvCoeff = [];
    this.result = [];
    this.t = 0;
    this.config = config;

    //空間内のウイルスを定義
    const virus = new Virus(config.variantConfig);
    this.VirusModel = virus; //Spaceモデルに記録
    // this.strainTypesArr = v.getStrainTypesArr(); //ウイルス情報を記録

    //ワクチンモデルを起動

    //Peopleインスタンスを空間の個数分生成
    const spaceConfig = config.models.Space;
    for (let i = 0; i < this.getSpaceLength(spaceConfig); i++) {
      //初期状態を定義
      //各空間に属するインスタンスを作成
      this.state.push({
        people: new People(config, virus),
      });
    }
  }

  updateWithLifeCycle() {
    //時間を進める
    this.t += 1;

    //ワクチン接種を実行
    // new PeopleVaccination(this);

    //人流移動を実行
    new PeopleTravel(this);

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
    for (const state of this.state) state.people.updateWithCycleEnd();
  }

  getSpaceLength(spaceConfig: any) {
    const row = spaceConfig.length.row;
    const col = spaceConfig.length.col;
    return row * col;
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
    //PeopleResultをそのまま返す
    return this.state.map((SpaceState) => SpaceState.people.result);
  }
}

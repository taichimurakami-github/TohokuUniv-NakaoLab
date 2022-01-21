const { generateCoeffMatrix } = require("../../calc/coeff");
const { getRandomFloat } = require("../../calc/lib");
const {
  PeopleStateTransition,
} = require("../Calculation/PeopleStateTransition");
const { People } = require("../People/People");
const { Virus } = require("../Virus/Virus");

/**
 * 空間を定義し、管理する
 * インスタンス生成時に空間作成を自動で行う
 */

class Space {
  constructor(config) {
    this.state = [];
    this.mvCoeff = [];
    this.result = {};
    this.config = config;

    //空間内のウイルスを定義
    const v = new Virus(config.variantConfig);

    //resultパース用に
    this.strainTypesArr = v.getStrainTypesArr();

    //Peopleインスタンスを空間の個数分生成
    for (let i = 0; i < config.params.spaceLength; i++) {
      //初期状態を定義
      // const initialPop = {
      //   S: Math.floor(
      //     // 初期人口：0.01 ~ 1.0 * max_const
      //     getRandomFloat(0.1, 1.0) * config.params.maxPopulationSize
      //   ),
      //   I_E: 100,
      // };

      //各空間に属するインスタンスを作成
      this.state.push({
        people: new People(config, v),
      });
    }
  }

  updateWithCycleStart() {
    //移動係数を更新
    // this.renewMvCoeff();

    //人流移動を開始
    // this.calcMove();

    //Peopleインスタンスで定義されたイベント開始
    for (const state of this.state) {
      state.people.updateWithCycleStart();
    }
  }

  updateWithCycleEnd() {
    //Peopleインスタンスで定義されたイベント開始
    for (const state of this.state) {
      state.people.updateWithCycleEnd();
    }
  }

  //People.transitionクラス
  executeTransition() {
    for (const state of this.state) {
      new Transition(state.people);
    }
  }

  getInstanceArrByID(instanceID) {
    return this.state.map((v) => {
      if (!v[instanceID])
        throw new Error("Space.getInstanceArrByID >> instanceIDが不正です。");
      return v[instanceID];
    });
  }

  renewMvCoeff() {
    return (this.mvCoeff = generateCoeffMatrix(
      this.getInstanceArrByID("people"),
      this.config.params.maxCoeffConst
    ));
  }

  //現在対象の空間以外の全ての空間に一定の割合で人が流出
  calcMove() {
    for (let i_from = 0; i_from < this.state.length; i_from++) {
      //移動元のインスタンスを取得
      const outflowFromSpaceInstance = this.state[i_from].people;

      for (let i_to = 0; i_to < this.state.length; i_to++) {
        if (i_from === i_to) continue;
        //流出先のインスタンスを定義
        const outflowToSpaceInstance = this.state[i_to].people;

        //移動係数を取得
        const mvCoeff = this.mvCoeff[i_from][i_to];

        //移動を実行
        for (const id of outflowFromSpaceInstance.getAllIDsArr()) {
          //流出量を計算
          const outflow = outflowFromSpaceInstance[id].pop * mvCoeff;

          //流出元に反映(-1をかける, muはdiff計算に入れない)
          // outflowFromSpaceInstance[id].setDiff(outflow * -1, true);
          // outflowFromSpaceInstance[id].applyDiff();

          //流出先に反映
          // outflowToSpaceInstance[id].setDiff(outflow, true);
          // outflowToSpaceInstance[id].applyDiff();
        }
      }
    }
  }

  /**
   * 各spaceごとのPeople.resultを返す
   *
   * -----------------------------------
   * + return structure:
   *  [
   *    <Parent Array ID = Space.state ID>
   *    {
   *      <Each Element has results of each Space.state>
   *       ArrayOfObj : People.result.ArrayOfObj : formatted result as Array of Object
   *       ArrayOfPop : People.result.ArrayOfPop : only population result as Array of Array
   *    },
   *    {
   *      ...
   *    }
   *  ]
   * -----------------------------------
   *
   * @returns {[{[String]: Array}]}
   */
  getResults() {
    //execute parse
    return this.state.reduce((prevResult, state) => {
      //result parse template
      const result = {
        asObject: [],
        asArray: [],
      };

      for (const r of state.people.result) {
        const tmpAsObj = {};
        const tmpAsArr = [];
        //register S,R
        tmpAsObj.S = r.S;
        tmpAsObj.R = r.R;

        tmpAsArr.push(r.S);
        tmpAsArr.push(r.R);

        //register I
        for (const [strainType, population] of Object.entries(r.I)) {
          tmpAsObj[`I_${strainType}`] = population;
          tmpAsArr.push(population);
        }

        //add to result
        result.asArray.push(tmpAsArr);
        result.asObject.push(tmpAsObj);
      }

      return [...prevResult, result];
    }, []);
  }
}

module.exports = { Space };

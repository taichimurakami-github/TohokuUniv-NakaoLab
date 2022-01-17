const { generateCoeffMatrix } = require("../../calc/coeff");
const { getRandomFloat } = require("../../calc/lib");
const { People } = require("../People/People");

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

    //Peopleインスタンスを空間の個数分生成
    for (let i = 0; i < config.params.spaceLength; i++) {
      //初期状態を定義
      const initialPop = {
        S: Math.floor(
          // 初期人口：0.01 ~ 1.0 * max_const
          getRandomFloat(0.1, 1.0) * config.params.maxPopulationSize
        ),
        I_E: 100,
      };
      //Peopleインスタンスを作成
      this.state.push(new People(config, initialPop));
    }
  }

  updateWithCycleStart() {
    //移動係数を更新
    this.renewMvCoeff();

    //人流移動を開始
    this.calcMove();

    //Peopleインスタンスで定義されたイベント開始
    for (const p of this.state) {
      p.updateWithCycleStart();
    }
  }

  updateWithCycleEnd() {
    //Peopleインスタンスで定義されたイベント開始
    for (const p of this.state) {
      p.updateWithCycleEnd();
    }
  }

  renewMvCoeff() {
    return (this.mvCoeff = generateCoeffMatrix(
      this.state,
      this.config.params.maxCoeffConst
    ));
  }
  //現在対象の空間以外の全ての空間に一定の割合で人が流出
  calcMove() {
    for (let i_from = 0; i_from < this.state.length; i_from++) {
      //移動元のインスタンスを取得
      const outflowFromSpaceInstance = this.state[i_from];

      for (let i_to = 0; i_to < this.state.length; i_to++) {
        if (i_from === i_to) continue;
        //流出先のインスタンスを定義
        const outflowToSpaceInstance = this.state[i_to];

        //移動係数を取得
        const mvCoeff = this.mvCoeff[i_from][i_to];

        //移動を実行
        for (const id of outflowFromSpaceInstance.getAllIDsArr()) {
          //流出量を計算
          const outflow = outflowFromSpaceInstance[id].pop * mvCoeff;

          //流出元に反映(-1をかける, muはdiff計算に入れない)
          outflowFromSpaceInstance[id].setDiff(outflow * -1, true);
          outflowFromSpaceInstance[id].applyDiff();

          //流出先に反映
          outflowToSpaceInstance[id].setDiff(outflow, true);
          outflowToSpaceInstance[id].applyDiff();
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
    return this.state.reduce((prevResult, p) => {
      return [
        ...prevResult,
        {
          ArrayOfObj: p.result.ArrayOfObj,
          ArrayOfPop: p.result.ArrayOfPop,
        },
      ];
    }, []);
  }
}

module.exports = { Space };

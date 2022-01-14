const { generateCoeffMatrix } = require("../../calc/coeff");
const { People } = require("../People/People");

/**
 * 空間を定義し、管理する
 * インスタンス生成時に空間作成を自動で行う
 */

class Space {
  constructor(p, config) {
    this.state = [];
    this.mvCoeff = [];
    this.result = {};

    //Peopleインスタンスを空間の個数分生成
    for (let i = 0; i < config.params.spaceLength; i++) {
      this.state.push(new People(config));
    }
  }

  updateWithCycleStart() {
    for (const p of this.state) {
      p.updateWithCycleStart();
    }
  }

  updateWithCycleEnd() {
    for (const p of this.state) {
      p.updateWithCycleEnd();
    }
  }

  renewMvCoeff() {
    return (this.mvCoeff = generateCoeffMatrix(
      this.state,
      this.config.max_coeff_const
    ));
  }

  calcMove() {
    const diff = [];
    const spaceLength = this.state.length;

    for (let i_from = 0; i_from < spaceLength; i_from++) {
      const selectedSpaceInstance = this.state[i_from];
      //現在対象の空間以外の全ての空間に一定の割合で人が流出
      for (let i_to = 0; i_to < spaceLength; i_to++) {
        if (i_from === i_to) continue;
        const outflow = {
          ...selectedSpaceInstance.struct.S,
          ...selectedSpaceInstance.struct,
        };
      }
    }
  }
}

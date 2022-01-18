const { getCombinationOfArray, calcCombination } = require("../../calc/lib");

class People {
  constructor(options, config, Variant) {
    this.state = [new NI({ p: options.initial_p, immunizedType: [], mu: 0 })];
    this.config = config;
    this.Variant = Variant;
  }

  getNodeLayorStructure() {
    //ノードになる基底状態を自動生成
    for (let i = 1; i <= this.Variant.length; i++) {
      //レイヤーに入れる組み合わせを作成
      const layorStructuredArray = getCombinationOfArray(
        this.Variant.getStrainTypesArray(), // all strain types as []:String
        calcCombination(this.Variant.length, i) // layor node length = n_variant C 1
      );
    }
  }
}

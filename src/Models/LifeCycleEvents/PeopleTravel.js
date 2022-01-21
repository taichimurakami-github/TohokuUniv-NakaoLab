const { generateCoeffMatrix } = require("../../calc/coeff");

class PeopleTravel {
  constructor(SpaceModel) {
    const s = SpaceModel;

    //移動係数を計算、保存
    this.mvCoeff = this.generateMvCoeff(s);

    //移動を実行
    for (let i_from = 0; i_from < s.state.length; i_from++) {
      //移動元のPeopleインスタンスを取得
      const P_outflowFrom = s.state[i_from].people;

      for (let i_to = 0; i_to < s.state.length; i_to++) {
        //流出先が流出元と同じPeopleだったらスキップ
        if (i_from === i_to) continue;

        //移動係数を取得
        const mvCoeff = this.mvCoeff[i_from][i_to];

        //流出先のPeopleインスタンスを取得
        const P_outflowTo = s.state[i_to].people;

        //移動計算を実行（全探索）
        this.calcMove(P_outflowFrom, P_outflowTo, mvCoeff);
      }
    }
  }

  calcMove(P_outflowFrom, P_outflowTo, mvCoeff) {
    //Space内で定義されたウイルス株設定は全空間で共通のものとなると仮定しているので、
    //Spaceが保持するすべてのPeopleインスタンス内のlayeredNodeの構造は同じになる
    for (let i = 0; i < P_outflowFrom.state.length; i++) {
      //phase1: 各レイヤー取り出し
      const layer_outflowFrom = P_outflowFrom.state.length[i];
      const layer_outflowTo = P_outflowTo.state.length[i];

      for (let j = 0; j < layer_outflowFrom.length; j++) {
        //phase2: 各ノード取り出し
        const node_outflowFrom = layer_outflowFrom[j];
        const node_outflowTo = layer_outflowTo[j];

        //phase3: NI系の移動
        const NI_outflow = node_outflowFrom.NI * mvCoeff;
        node_outflowFrom.NI.p -= NI_outflow;
        node_outflowTo.NI.p += NI_outflow;

        for (const key of Object.keys(node_outflowFrom.I)) {
          //phase4: I系の移動
          const I_outflowFrom_instance = node_outflowFrom.I[key];
          const I_outflowTo_instance = node_outflowTo.I[key];
          const I_outflow = I_outflowFrom_instance.p * mvCoeff;

          I_outflowFrom_instance.p -= I_outflow;
          I_outflowTo_instance.p += I_outflow;
        }
      }
    }
  }

  generateMvCoeff(SpaceModel) {
    const config = SpaceModel.config;
    return generateCoeffMatrix(
      this.getInstanceArrByID("people"),
      config.params.maxCoeffConst
    );
  }
}

module.exports = { PeopleTravel };

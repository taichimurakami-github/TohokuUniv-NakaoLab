class VirusMutation {
  constructor(SpaceModel) {
    const s = SpaceModel;
    const v = s.VirusModel;

    for (const variantConfig of v.config) {
      //ウイルス出現時刻だったら、新規株の感染者を発生させる
      if (variantConfig.appearanceTime === s.t) {
        //spaceの保持する各peopleクラスに対して計算を実行
        for (const state of s.state) {
          this.mutationInfectorAppearance(
            variantConfig.strainType,
            0.001,
            state.people
          );
        }
      }
    }
  }

  mutationInfectorAppearance(strainType, initialInfectorRate, PeopleModel) {
    //初期感染者数を定義
    const initialInfectorPopulation = PeopleModel.sum.S * initialInfectorRate;
    //ノード内を全探索
    for (const layer of PeopleModel.state) {
      for (const node of layer) {
        for (const I of Object.values(node.I)) {
          if (I.strainType === strainType) I.p += initialInfectorPopulation;
        }
      }
    }
  }
}

module.exports = { VirusMutation };

import { People } from "../People/People";
import { Space } from "../Space/Space";

export class VirusMutation {
  constructor(SpaceModel: Space) {
    const s = SpaceModel;
    const v = s.VirusModel;

    /**
     * 2022.01.28
     * 特定空間内にウイルスを放つための条件分岐を実装
     * variantConfig.appearanceAtが定義されている時のみ判定処理を実行
     */
    for (const variantConfig of v.config) {
      //ウイルス出現時刻だったら、新規株の感染者を発生させる
      if (variantConfig.appearanceTime === s.t) {
        const appearanceAt = variantConfig?.appearanceAt || [];
        let cnt = 0;
        for (let i = 0; i < s.state.length; i++) {
          /**
           * + if appearanceAt.length > 0:
           *  > 定義されている空間ID配列に含まれる空間のPeopleインスタンスに対してのみ計算を実行
           * + else:
           *  > spaceの保持する各peopleクラスに対して計算を実行
           */
          if (appearanceAt.length > 0) {
            //設定された空間全ての計算が終わっていたらbreak
            if (cnt === appearanceAt.length) break;

            //設定された空間に該当しなければcontinue
            if (!appearanceAt.includes(i)) continue;

            //計算実行 -> フラグカウンタを回す
            cnt++;
          }
          const state = s.state[i];
          this.mutationInfectorAppearance(
            variantConfig.strainType,
            0.001,
            state.people
          );
        }
      }
    }
  }

  mutationInfectorAppearance(
    strainType: string,
    initialInfectorRate: number,
    PeopleModel: People
  ) {
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

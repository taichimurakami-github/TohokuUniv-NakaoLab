import { People } from "../People/People";
import { Space } from "../Space/Space";

export class VirusMutation {
  constructor(SpaceModel: Space) {
    const s = SpaceModel;
    const c = s.Config;

    /**
     * 2022.01.28
     * 特定空間内にウイルスを放つための条件分岐を実装
     * variantConfig.appearanceAtが定義されている時のみ判定処理を実行
     */
    for (const [strainType, variantConfig] of Object.entries(
      c.getVirusConfig()
    )) {
      //ウイルス出現時刻だったら、新規株の感染者を発生させる
      if (variantConfig.appearanceTime === s.t) {
        const appearanceAt = variantConfig.appearanceAt;
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
          const people = s.state[i].people;

          //初期感染者数を定義: layer 1 の合致するstrainTypeを持つEに人口発生
          for (const node of people.state[1]) {
            if (node.E[strainType]) {
              const infectible = people.sum.NI + people.sum.E.ALL;
              node.E[strainType].p += infectible * c.getInitialInfectiousRate();
              // node.E[strainType].p += 1;
              break;
            }
          }
        }
      }
    }
  }
}

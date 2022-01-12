/**
 * 人間の状態を管理するクラスの基底クラス
 * 共通部分を定義する
 *
 * <各状態のクラスで用いる機能一覧>
 *
 *  === 共通 ===
 * + 該当する人口を取り出す -> 共通(CLASS.pop)
 * + diffを反映する -> 共通(setDiff)
 * + 現在の状態に対応する時間を格納 -> 共通(CLASS.t)
 *
 *  === 個別 ===
 *
 * + sigmaを保持する -> R
 * + gammaを保持する -> S, R
 * + betaを保持する -> I
 *  => それぞれの定数は
 *
 * + activityDistを保持する -> S,R
 * + 遷移定数を保持する -> 各子クラスで定義
 *  - S: beta_E, beta_M
 *  - I_E: gamma_E, epsilon_EM
 *  - I_M: gamma_M
 *  - R_E: beta_RE_E, beta_RE_M, sigma_RE_S
 *  - R_M: beta_RM_E, beta_RM_M, sigma_RM_S
 *  - I_RE_E: gamma_RE_E
 *  - I_RM_M: gamma_RM_M
 *  - I_RE_M: gamma_RE_M
 *  - I_RM_E: gamma_RM_E
 *  - R_EM: beta_REM_E, beta_REM_M, sigma_REM_RE, sigma_REM_RM
 *  - I_REM_E: gamma_
 *
 *    => これらをまとめて、getDiff()を定義できないか？
 *    (1) 引数にdiffを計算する相手を入れる
 *    (2) 相手に応じて、適当なモデル係数を掛け合わせた結果を返す
 *
 *    => そのために必要な関数
 *    (1) getActivationDist(sum, infectedSum)
 *        >> getDiffより呼び出す
 *        >> S, Rのみ実装、現在の人口分布に基づいてactivationDistを計算・取得する
 *
 *    (2) getDiff(target, sum, infectedSum)
 *        >> targetに渡された基底クラスのtypeに基づき、
 */

class BasicPeopleState {
  constructor(ID, initialPopulation, eqConsts) {
    this.ID = ID; //ID(I_RE_Mなど)
    this.type = [...ID][0]; //S,I,Rが入る
    this.pop = initialPopulation; // 人数
    this.diff = 0;
    //その他eqConst
    for (const [key, val] of Object.entries(eqConsts)) {
      this[key] = val;
    }
  }

  //diffを定義 : muを自動的に反映
  setDiff(diffVal) {
    if (isNaN(diffVal))
      throw new Error(`error at ${this.ID}.setDiff() : diffVal が NaN です。`);

    const deaths = this.mu * this.pop;

    //計算結果チェック
    if (diffVal + this.pop < 0)
      throw new Error(
        `error at ${this.ID}.setDiff() : diffVal + this.pop が負になりました。`
      );

    if (diffVal - deaths + this.pop < 0)
      throw new Error(
        `error at ${this.ID}.setDiff() : diffVal - deaths + this.pop が負になりました。`
      );

    //ライフサイクルにおける死亡者数を計算し、自動的に差分に反映
    return (this.diff = diffVal - deaths);
  }

  applyDiff() {
    //diffとdeathsをpopulationに反映し、リセットする
    this.pop += this.diff;

    //ただし、this.pupulation + this.diff < 0の場合はエラー
    if (this.pop < 0) throw new Error("計算結果が負になりました。");
  }
}

module.exports = { BasicPeopleState };

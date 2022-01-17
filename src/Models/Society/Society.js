/**
 * SocietyModel
 *
 * + 感染状況をモニタリング・分析
 * + 分析結果に応じて、社会的要素を表すパラメータを更新する
 */

class Society {
  constructor(config) {
    this.config = config;
    this.alertLevel = "MIN";
    // this.policy =
    this.analizeResult = {
      Infectious: {
        explosionTime: [], //感染爆発部分の極大値を格納
      },
    };
  }

  analizeInfectious(p) {
    const depth = this.config.societyCheckDepth;

    // 直近 config.societyCheckDepth 回分の感染者合計結果を取得
    const recentInfectiousNumbers = [];
    for (let i = depth; i >= 0; i--) {
      recentInfectiousNumbers.push(
        p.result.ArrayOfObj[i].sum_I_EX + p.result.ArrayOfObj[i].sum_I_MX
      );
    }
    // それぞれの差分を出す -> recentInfectiousDiffs[]に保存
    const recentInfectiousDiffs = [];
    for (let i = recentInfectiousNumbers.length; i > 0; i--) {
      recentInfectiousDiffs.push(
        recentInfectiousNumbers[i] - recentInfectiousNumbers[i - 1]
      );
    }
  }

  getNowAlertLevel() {
    const nowInfectuiousRatio = this.p.getSum("I") / this.p.getSum();

    if (nowInfectuiousRatio <= thresholds.min) {
      //alertLevel : min
      //beta : max
      console.log("MIN");
      return (beta) => beta + (1 - beta) / 3;
    } else if (nowInfectuiousRatio >= thresholds.max) {
      //alertLevel : max
      //beta : min
      console.log("MAX");
      return (beta) => beta * 0.5;
    } else {
      //alertLevel : mid
      //beta : standard
      console.log("MID");
      return (beta) => beta;
    }
  }
}

// const getInfectionCoeff = (beta, activityDist) => {
//   //感染率をそれぞれ定義
//   const high = (beta * (1 - beta)) / 2;
//   const mid = beta;
//   const low = beta * 0.2;

//   //beta * activityDist.stateの和を返す
//   return (
//     high * activityDist.high + mid * activityDist.mid + low * activityDist.low
//   );
// };

// const getActivityDist = () => {
//   return {
//     high: 0,
//     mid: 0,
//     low: 0,
//   };
// };

module.exports = { Society };

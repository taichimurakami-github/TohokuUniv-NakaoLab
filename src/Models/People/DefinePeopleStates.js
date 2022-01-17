const { Infectious } = require("../BasicStates/InfectiousClass");
const { Recovered } = require("../BasicStates/RecoveredClass");
const { Susceptible } = require("../BasicStates/SusceptibleClass");
const { PeopleStateDefaults, strainTypes } = require("./defaults");

/**
 * class PeopleState
 *
 * 人々の状態を管理する
 */
class DefinePeopleStates {
  constructor() {
    this.struct = {
      S: ["S"],
      I: [
        "I_E",
        "I_M",
        "I_RE_E",
        "I_RE_M",
        "I_RM_E",
        "I_RM_M",
        "I_REM_E",
        "I_REM_M",
      ],
      R: ["R_E", "R_M", "R_EM"],
    };
    this.t = 0; //時間
    this.result = {
      ArrayOfPop: [],
      ArrayOfObj: [],
    };

    /**
     * Susceptible class instance generation
     */
    this.S = new Susceptible("S", 0, { ...PeopleStateDefaults.S });

    /**
     * Infection class instance generation
     */

    //E系
    this.I_E = new Infectious(
      "I_E",
      0,
      strainTypes["001"], //strain E
      { ...PeopleStateDefaults.I_E }
    );

    this.I_RE_E = new Infectious(
      "I_RE_E",
      0,
      strainTypes["001"], //strain E
      { ...PeopleStateDefaults.I_RE_E }
    );

    this.I_RE_M = new Infectious(
      "I_RE_M",
      0,
      strainTypes["002"], //strain M
      { ...PeopleStateDefaults.I_RE_M }
    );

    //M系
    this.I_M = new Infectious(
      "I_M",
      0,
      strainTypes["002"], //strain M
      { ...PeopleStateDefaults.I_M }
    );

    this.I_RM_M = new Infectious(
      "I_RM_M",
      0,
      strainTypes["002"], //strain M
      { ...PeopleStateDefaults.I_RM_M }
    );

    this.I_RM_E = new Infectious(
      "I_RM_E",
      0,
      strainTypes["001"], //strain E
      { ...PeopleStateDefaults.I_RM_E }
    );

    //EM系
    this.I_REM_E = new Infectious(
      "I_REM_E",
      0,
      strainTypes["001"], //strain E
      { ...PeopleStateDefaults.I_REM_E }
    );

    this.I_REM_M = new Infectious(
      "I_REM_M",
      0,
      strainTypes["002"], //strain M
      { ...PeopleStateDefaults.I_REM_M }
    );

    /**
     * Recovered class instance generation
     */
    this.R_E = new Recovered("R_E", 0, strainTypes["001"], {
      ...PeopleStateDefaults.R_E,
    });

    this.R_M = new Recovered("R_M", 0, strainTypes["002"], {
      ...PeopleStateDefaults.R_M,
    });

    this.R_EM = new Recovered(
      "R_EM",
      0,
      strainTypes["001"] + strainTypes["002"],
      { ...PeopleStateDefaults.R_EM }
    );
  }
}

module.exports = { DefinePeopleStates };

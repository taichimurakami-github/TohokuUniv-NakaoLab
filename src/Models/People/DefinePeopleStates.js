const { initialEqConst } = require("../config/const");
const { initialEqState } = require("../config/state");
const { Infectious } = require("../BasicStates/InfectiousClass");
const { Recovered } = require("../BasicStates/RecoveredClass");
const { Susceptible } = require("../BasicStates/SusceptibleClass");

/**
 * structure and settings
 */
const peopleBasicStateStruct = {
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
  R: ["R_E", "R_M", "R_M"],
};

const strainTypes = {
  "001": "E",
  "002": "M",
};

/**
 * class PeopleState
 *
 * 人々の状態を管理する
 */
class DefinePeopleStates {
  constructor() {
    this.struct = { ...peopleBasicStateStruct };
    this.t = 0; //時間
    this.result = {
      ArrayOfPop: [],
      ArrayOfObj: [],
    };

    /**
     * Susceptible class instance generation
     */
    this.S = new Susceptible("S", initialEqState.S, {
      beta: {
        [strainTypes["001"]]: initialEqConst.beta_E, //beta.E
        [strainTypes["002"]]: initialEqConst.beta_M, //beta.M
      },
      mu: initialEqConst.mu_S,
    });

    /**
     * Infection class instance generation
     */

    //E系
    this.I_E = new Infectious(
      "I_E",
      initialEqState.I_E,
      strainTypes["001"], //strain E
      "", //never immunized
      {
        beta: {
          [strainTypes["002"]]: initialEqConst.epsilon_EM,
        },
        gamma: {
          [strainTypes["001"]]: initialEqConst.gamma_E, //recover to R_E
        },
        mu: initialEqConst.mu_E,
      }
    );

    this.I_RE_E = new Infectious(
      "I_RE_E",
      initialEqState.I_RE_E,
      strainTypes["001"], //strain E
      strainTypes["002"], //type E immunized
      {
        gamma: {
          [strainTypes["001"]]: initialEqConst.gamma_RE_E, //recover to R_E
        },
        mu: initialEqConst.mu_RE_E,
      }
    );

    this.I_RE_M = new Infectious(
      "I_RE_M",
      initialEqState.I_RE_M,
      strainTypes["002"], //strain M
      strainTypes["002"], //type E immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_RE_M, //recover to R_EM
        },
        mu: initialEqConst.mu_RE_M,
      }
    );

    //M系
    this.I_M = new Infectious(
      "I_M",
      initialEqState.I_M,
      strainTypes["002"], //strain M
      "", //never immunized
      {
        gamma: {
          [strainTypes["002"]]: initialEqConst.gamma_M, //recover to R_M
        },
        mu: initialEqConst.mu_M,
      }
    );

    this.I_RM_M = new Infectious(
      "I_RM_M",
      initialEqState.I_RM_M,
      strainTypes["002"], //strain M
      strainTypes["002"], //type M immunized
      {
        gamma: {
          [strainTypes["002"]]: initialEqConst.gamma_RM_M, //recover to R_M
        },
        mu: initialEqConst.mu_RM_M,
      }
    );

    this.I_RM_E = new Infectious(
      "I_RM_E",
      initialEqState.I_RM_E,
      strainTypes["001"], //strain E
      strainTypes["002"], //type M immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_RM_E, //recover to R_EM
        },
        mu: initialEqConst.mu_RM_E,
      }
    );

    //EM系
    this.I_REM_E = new Infectious(
      "I_REM_E",
      initialEqState.I_REM_E,
      strainTypes["001"], //strain E
      strainTypes["001"] + strainTypes["002"], //type E and M immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_REM_E, //recover to R_EM
        },
        mu: initialEqConst.mu_REM_E,
      }
    );

    this.I_REM_M = new Infectious(
      "I_REM_M",
      initialEqState.I_REM_M,
      strainTypes["002"], //strain M
      strainTypes["001"] + strainTypes["002"], //type E and M immunized
      {
        gamma: {
          [strainTypes["001"] + strainTypes["002"]]: initialEqConst.gamma_REM_M, //recover to R_EM
        },
        mu: initialEqConst.mu_REM_M,
      }
    );

    /**
     * Recovered class instance generation
     */
    this.R_E = new Recovered("R_E", initialEqState.R_E, strainTypes["001"], {
      beta: {
        [strainTypes["001"]]: initialEqConst.beta_RE_E,
        [strainTypes["002"]]: initialEqConst.beta_RE_M,
      },
      sigma: {
        ["S"]: initialEqConst.sigma_RE_S,
      },
      mu: initialEqConst.mu_RE,
    });

    this.R_M = new Recovered("R_M", initialEqState.R_E, strainTypes["002"], {
      beta: {
        [strainTypes["001"]]: initialEqConst.beta_RM_E,
        [strainTypes["002"]]: initialEqConst.beta_RM_M,
      },
      sigma: {
        ["S"]: initialEqConst.sigma_RM_S,
      },
      mu: initialEqConst.mu_RM,
    });

    this.R_EM = new Recovered(
      "R_EM",
      initialEqState.R_E,
      strainTypes["001"] + strainTypes["002"],
      {
        beta: {
          [strainTypes["001"]]: initialEqConst.beta_REM_E,
          [strainTypes["002"]]: initialEqConst.beta_REM_M,
        },
        sigma: {
          ["R_E"]: initialEqConst.sigma_REM_RE,
          ["R_M"]: initialEqConst.sigma_REM_RM,
        },
        mu: initialEqConst.mu_RE_M,
      }
    );
  }
}

module.exports = { DefinePeopleStates };

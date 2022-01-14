const { initialEqConst } = require("../config/const");
const { initialEqState } = require("../config/state");
const { Infectious } = require("../BasicStates/InfectiousClass");
const { Recovered } = require("../BasicStates/RecoveredClass");
const { Susceptible } = require("../BasicStates/SusceptibleClass");

/**
 * structure and settings
 */

const strainTypes = {
  "001": "E",
  "002": "M",
};

const defaultEqConsts = {
  S: {
    beta: {
      [strainTypes["001"]]: 0.5, //beta.E
      [strainTypes["002"]]: 0, //beta.M
    },
    mu: 0,
  },
  I_E: {
    beta: {
      [strainTypes["002"]]: 0, //epsilon_EM : >> I_M,
    },
    gamma: {
      [strainTypes["001"]]: 0.3, //gamma_E >> recover to R_E
    },
    mu: 0,
  },
  I_RE_E: {
    gamma: {
      [strainTypes["001"]]: 0.3, //gamma_RE_E >> recover to R_E
    },
    mu: 0,
  },
  I_RE_M: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_RE_M >> recover to R_EM
    },
    mu: 0,
  },
  I_M: {
    gamma: {
      [strainTypes["002"]]: 0.3, //gamma_M >> recover to R_M
    },
    mu: 0,
  },
  I_RM_M: {
    gamma: {
      [strainTypes["002"]]: 0.3, //gamma_RM_M >> recover to R_M
    },
    mu: 0,
  },
  I_RM_E: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_RM_E >> recover to R_EM
    },
    mu: 0,
  },
  I_REM_E: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_REM_E >> recover to R_EM
    },
    mu: 0,
  },
  I_REM_M: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_REM_M >> recover to R_EM
    },
    mu: 0,
  },
  R_E: {
    beta: {
      [strainTypes["001"]]: 0.2, //beta_RE_E
      [strainTypes["002"]]: 0, //beta_RE_M
    },
    sigma: {
      ["S"]: 0.02, //sigma_RE_S
    },
    mu: 0,
  },
  R_M: {
    beta: {
      [strainTypes["001"]]: 0.2, //beta_RM_E
      [strainTypes["002"]]: 0.2, //beta_RM_M
    },
    sigma: {
      ["S"]: 0.02, //sigma_RM_S
    },
    mu: 0,
  },
  R_EM: {
    beta: {
      [strainTypes["001"]]: 0.3, //beta_REM_E
      [strainTypes["002"]]: 0.4, //beta_REM_M
    },
    sigma: {
      ["R_E"]: 0, //sigma_REM_RE
      ["R_M"]: 0, //sigma_REM_RM
    },
    mu: 0,
  },
};

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
    this.S = new Susceptible("S", initialEqState.S, {
      ...defaultEqConsts.S,
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
      { ...defaultEqConsts.I_E }
    );

    this.I_RE_E = new Infectious(
      "I_RE_E",
      initialEqState.I_RE_E,
      strainTypes["001"], //strain E
      strainTypes["002"], //type E immunized
      { ...defaultEqConsts.I_RE_E }
    );

    this.I_RE_M = new Infectious(
      "I_RE_M",
      initialEqState.I_RE_M,
      strainTypes["002"], //strain M
      strainTypes["002"], //type E immunized
      { ...defaultEqConsts.I_RE_M }
    );

    //M系
    this.I_M = new Infectious(
      "I_M",
      initialEqState.I_M,
      strainTypes["002"], //strain M
      "", //never immunized
      { ...defaultEqConsts.I_M }
    );

    this.I_RM_M = new Infectious(
      "I_RM_M",
      initialEqState.I_RM_M,
      strainTypes["002"], //strain M
      strainTypes["002"], //type M immunized
      { ...defaultEqConsts.I_RM_M }
    );

    this.I_RM_E = new Infectious(
      "I_RM_E",
      initialEqState.I_RM_E,
      strainTypes["001"], //strain E
      strainTypes["002"], //type M immunized
      { ...defaultEqConsts.I_RM_E }
    );

    //EM系
    this.I_REM_E = new Infectious(
      "I_REM_E",
      initialEqState.I_REM_E,
      strainTypes["001"], //strain E
      strainTypes["001"] + strainTypes["002"], //type E and M immunized
      { ...defaultEqConsts.I_REM_E }
    );

    this.I_REM_M = new Infectious(
      "I_REM_M",
      initialEqState.I_REM_M,
      strainTypes["002"], //strain M
      strainTypes["001"] + strainTypes["002"], //type E and M immunized
      { ...defaultEqConsts.I_REM_M }
    );

    /**
     * Recovered class instance generation
     */
    this.R_E = new Recovered("R_E", initialEqState.R_E, strainTypes["001"], {
      ...defaultEqConsts.R_E,
    });

    this.R_M = new Recovered("R_M", initialEqState.R_E, strainTypes["002"], {
      ...defaultEqConsts.R_M,
    });

    this.R_EM = new Recovered(
      "R_EM",
      initialEqState.R_E,
      strainTypes["001"] + strainTypes["002"],
      { ...defaultEqConsts.R_EM }
    );
  }
}

module.exports = { DefinePeopleStates };

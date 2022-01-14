/**
 * structure and settings
 */

const strainTypes = {
  "001": "E",
  "002": "M",
};

const PeopleStateDefaults = {
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
    //no immunized
  },
  I_RE_E: {
    gamma: {
      [strainTypes["001"]]: 0.3, //gamma_RE_E >> recover to R_E
    },
    mu: 0,
    theta: 0.85,
    immunizedType: strainTypes["001"],
  },
  I_RE_M: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_RE_M >> recover to R_EM
    },
    mu: 0,
    theta: 0.7,
    immunizedType: strainTypes["001"],
  },
  I_M: {
    gamma: {
      [strainTypes["002"]]: 0.3, //gamma_M >> recover to R_M
    },
    mu: 0,
    //no immunized
  },
  I_RM_M: {
    gamma: {
      [strainTypes["002"]]: 0.3, //gamma_RM_M >> recover to R_M
    },
    mu: 0,
    theta: 0.7,
    immunizedType: strainTypes["002"],
  },
  I_RM_E: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_RM_E >> recover to R_EM
    },
    mu: 0,
    theta: 0.65,
    immunizedType: strainTypes["002"],
  },
  I_REM_E: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_REM_E >> recover to R_EM
    },
    mu: 0,
    theta: 0.5,
    immunizedType: strainTypes["001"] + strainTypes["002"],
  },
  I_REM_M: {
    gamma: {
      [strainTypes["001"] + strainTypes["002"]]: 0.3, //gamma_REM_M >> recover to R_EM
    },
    mu: 0,
    theta: 0.5,
    immunizedType: strainTypes["001"] + strainTypes["002"],
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

module.exports = { PeopleStateDefaults, strainTypes };

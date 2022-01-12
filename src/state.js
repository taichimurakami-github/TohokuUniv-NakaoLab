const initialEqState = {
  S: 1000000,
  I_E: 100,
  I_M: 0,
  R_E: 0,
  R_M: 0,
  I_RE_E: 0,
  I_RE_M: 0,
  I_RM_M: 0,
  I_RM_E: 0,
  R_EM: 0,
  I_REM_E: 0,
  I_REM_M: 0,
};

const initialActivityDist = {
  high: 1,
  mid: 0,
  low: 0,
  zero: 0,
};

module.exports = { initialEqState, initialActivityDist };

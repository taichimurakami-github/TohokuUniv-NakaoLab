const initialEqConst = {
  /**
   * S >> I_E, I_M
   */
  beta_E: 0.05,
  beta_M: 0.20,

  /**
   * I_E, I_M >> R_E, R_M
   */
  gamma_E: 0.4,
  gamma_M: 0,

  /**
   * R_E >> I_RE_M
   * I_RE_M >> R_EM
   * &&
   * R_E <=> I_RE_E
   */
  beta_RE_M: 0.2,
  gamma_RE_M: 0.4,
  beta_RE_E: 0.025,
  gamma_RE_E: 0.4,

  /**
   * R_M >> I_RM_E
   * I_RM_E >> R_EM
   * &&
   * R_M <=>  I_RM_M
   */
  beta_RM_E: 0.05,
  gamma_RM_E: 0.4,
  beta_RM_M: 0.1,
  gamma_RM_M: 0.4,

  /**
   * R_EM <=> I_REM_E, I_REM_M
   */
  beta_REM_E: 0.025,
  gamma_REM_E: 0.4,
  beta_REM_M: 0.1,
  gamma_REM_M: 0.4,

  /**
   * feed back coefficient
   */
  sigma_REM_RE: 0.05,
  sigma_REM_RM: 0.2,
  sigma_RE_S: 0.2,
  sigma_RM_S: 0.5,

  /**
   * mutual coefficient
   */
  mu_S: 0,
  mu_E: 0,
  mu_M: 0,
  mu_RE: 0,
  mu_RM: 0,
  mu_RE_E: 0,
  mu_RE_M: 0,
  mu_RM_M: 0,
  mu_RM_E: 0,
  mu_REM: 0,
  mu_REM_E: 0,
  mu_REM_M: 0,

  /**
   * mutation coefficient & const
   */
  epsilon_EM: 0,
  EPSILON_M: 0,
}

module.exports = { initialEqConst }
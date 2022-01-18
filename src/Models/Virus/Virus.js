module.exports = class Variant {
  constructor(variantDefaults) {
    this.state = [...variantDefaults];
  }

  getStrainTypesArray() {
    return this.state.map((val) => val.strainType);
  }
};

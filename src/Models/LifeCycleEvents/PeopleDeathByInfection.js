class PeopleDeath {
  constructor(SpaceModel) {
    const s = SpaceModel;
    const v = SpaceModel.VirusModel;

    for (const spaceState of s.state) {
      this.calcDeathByInfection(spaceState.people, v);
    }
  }

  calcDeathByInfection(People, VirusModel) {
    for (const layer of People.state) {
      for (const node of layer) {
        node.NI.applyDeathByNatural();

        //layer内のI探索
        for (const I of Object.values(node.I)) I.applyDeathByInfection();

        //layer内のRI探索
        for (const RI of Object.values(node.RI)) RI.applyDeathByInfection();
      }
    }
  }
}

module.exports = { PeopleDeath };

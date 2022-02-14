class PeopleVaccination {
  constructor(SpaceModel) {
    const vaccineConfig = SpaceModel.config.vaccine;
    for (const vaccine of vaccineConfig) {
      //vaccineのconfigロジック
      //該当するならVaccinateする
      // this.calcVaccination(s.people);
    }
  }

  calcVaccination(p, vaccineConfig) {
    for (const layer of p.state) {
      for (const node of layer) {
        //NI
        node.NI.vaccinate(vaccineConfig);

        //I
        for (const I of Object.values(node.I)) {
          I.vaccinate(vaccineConfig);
        }

        //RI
        for (const RI of Object.values(node.RI)) {
          RI.vaccinate(vaccineConfig);
        }
      }
    }
  }
}

module.exports = { PeopleVaccination };

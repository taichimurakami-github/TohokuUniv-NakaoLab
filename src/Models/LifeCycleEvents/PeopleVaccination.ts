import { Space } from "../Space/Space";

export class PeopleVaccination {
  constructor(SpaceModel: Space) {
    const vaccineConfig = SpaceModel.config.vaccine;
    const state = SpaceModel.state;
    const t = SpaceModel.t;

    for (const vaccine of vaccineConfig) {
      //接種開始日以前の設定に対しては処理を行わない
      if (t < vaccine.begin.time) continue;

      for (const begin of vaccine.begin) {
        //ワクチン接種開始
        //ワクチン再接種による減衰率の復元
        if (t === vaccine.begin.time) {
          this.beginOrRestartEffect(SpaceModel, vaccine);
          continue;
        }

        //ワクチン効果消滅
        if (t === vaccine.begin.time + vaccine.duration) {
          this.expireEffect(SpaceModel, vaccine);
          continue;
        }
      }
    }
  }

  //ワクチン接種開始
  //ワクチン再接種による減衰率の復元
  beginOrRestartEffect(SpaceModel: Space, vaccine) {
    for (const s of SpaceModel.state) {
      s.vaccinated[vaccine.name] = {
        vaccinatedAt: SpaceModel.t,
        attenuationCoeff: 1,
      };
    }
  }

  //減衰率
  setAttenuationEffect(SpaceModel: Space, vaccine) {
    for (const s of SpaceModel.state) {
      const duration = vaccine.duration;
      const vaccinatedAt = s.vaccinated[vaccine.name].vaccinatedAt;
      const attenuationRate = (SpaceModel.t - vaccinatedAt) / duration;

      s.vaccinated[vaccine.name].attenuationCoeff = attenuationRate;
    }
  }

  //ワクチン効果消滅
  expireEffect(SpaceModel: Space, vaccine) {
    for (const s of SpaceModel.state) {
      delete s.vaccinated[vaccine.name];
    }
  }
}

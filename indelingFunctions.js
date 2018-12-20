module.exports = {
  rijdersMan: [],
  rijdersVrouw: [],
  bijrijders: [],
  ritIndeling: [],

  // INIT ronde maken
  maken: function(data) {
    this.rijdersMan = [];
    this.rijdersvrouw = [];
    this.bijrijders = [];
    this.ritIndeling = [];

    this.rijdersMan = data.filter(e => {
      return e.driver === 'Rijder' && e.gender === 'male';
    });
    this.rijdersVrouw = data.filter(e => {
      return e.driver === 'Rijder' && e.gender === 'female';
    });
    this.bijrijders = data.filter(e => {
      return e.driver === 'Bijrijder';
    });

    this.bijrijders.forEach(bijrijder => this.plaatsen(bijrijder));

    return this.ritIndeling;
  },

  // INdeling maken op basis van kwaliteitsscore van paar
  checkScore: function(bijrijder) {
    // Indeling op score
    // Score maken van alle rijders bij gegeven bijrijder
    let scoreArray = [];
    let ageValue = 2; // Waarde om van startscore af te trekken per jaar leeftijdsverschil
    let checkArray = bijrijder.gender === 'male' ? this.rijdersVrouw : this.rijdersMan; // Als man, rijdersVrouw checken, anders rijdersMan checken

    checkArray.forEach(function(rijder) {
      // Maak kwaliteitscore voor plaatsing
      let startValue = 100;
      let diff = Math.abs(bijrijder.age - rijder.age); // Bereken verschil, altijd positief getal
      startValue -= diff * ageValue; // Aftrekkenv van startValue
      scoreArray.push({
        obj: rijder,
        score: startValue
      }); //Schrijf waarde naar Array
    });
    //Sorteer op hoogste waarde
    scoreArray.sort(function(a, b) {
      return b.score - a.score;
    });

    return scoreArray;
  },

  // Bijrijder plaatsen
  plaatsen: function(bijrijder) {
    let scoreArray = this.checkScore(bijrijder);
    let geplaatst = false;
    let i = 0;
    let maxPax = 1;

    // While geplaatst false
    while (geplaatst === false) {
      // Zet obj van rijder uit scoreArray in temp var
      let rijder = scoreArray[i].obj;
      // als bijrijder id niet in rijder.partners staat
      if (rijder.partners.indexOf(bijrijder._id) === -1) {
        // -- -- Check of rijder al aanwezig in ritIndeling
        let index = this.ritIndeling.findIndex(item => item.rijder === rijder);
        if (index === -1) {
          // -- -- -- Zo nee: Aanmaken en plaatsen
          let obj = {
            rijder: rijder,
            bijrijder: []
          };
          obj.bijrijder.push(bijrijder);
          this.ritIndeling.push(obj);
          geplaatst = true;
        } else {
          // -- -- -- Anders: Check of passagiers minder dan maxPax is && genoeg ruimte in de auto
          if (
            this.ritIndeling[index].bijrijder.length < maxPax &&
            this.ritIndeling[index].bijrijder.length < rijder.seats - 1
          ) {
            // -- -- -- -- Zo ja: Plaatsen
            this.ritIndeling[index].bijrijder.push(bijrijder);
            geplaatst = true;
          }
        }
      }
      // Als niets getriggerd heeft. Volgende bekijken
      i++;
      // als i groter dan length rijders, toestaan +1 passagier
      if (i >= scoreArray.length) {
        maxPax++;
        i = 0;
        if (maxPax === 7) {
          console.log(`Kon ${bijrijder.name} niet plaatsen. MaxPax = ${maxPax} - i: ${i}`);
          break;
        }
      }
    }
  }
};

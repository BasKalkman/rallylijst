var faker = require('faker/locale/nl');
var Deelnemer = require('./models/Deelnemer');

module.exports = {
  maakDeelnemer: function() {
    let nieuweDeelnemer = {
      name: faker.name.findName(),
      gender: 'male',
      age: 40 + Math.floor(Math.random() * 20),
      driver: 'Rijder',
      seats: 2 + Math.floor(Math.random() * 5)
    };
    return nieuweDeelnemer;
  },

  seedDB: function() {
    Deelnemer.remove({}, function(err) {
      console.log('Dropped table');
    });
    for (i = 0; i < 60; i++) {
      var nieuweDeelnemer = this.maakDeelnemer();
      if (i % 2 === 0) {
        nieuweDeelnemer.gender = 'female';
        nieuweDeelnemer.driver = 'Bijrijder';
      }
      Deelnemer.create(nieuweDeelnemer, (err, deelnemer) => {
        if (err) {
          console.log('Er ging iets fout bij het maken van de deelnemer');
        }
      });
    }
  }
};

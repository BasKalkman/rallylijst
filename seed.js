var faker = require('faker/locale/nl');
var Deelnemer = require('./models/Deelnemer');
var User = require('./models/User');
var bcrypt = require('bcryptjs');

module.exports = {
  maakDeelnemer: function() {
    let nieuweDeelnemer = {
      name: faker.name.findName(),
      gender: 'male',
      age: 40 + Math.floor(Math.random() * 25),
      driver: 'Rijder',
      phone: faker.phone.phoneNumber(),
      seats: 5
    };
    return nieuweDeelnemer;
  },

  seedDB: function() {
    Deelnemer.remove({}, function(err) {
      console.log('Dropped table');
    });
    for (i = 0; i < 30; i++) {
      var nieuweDeelnemer = this.maakDeelnemer();
      if (Math.floor(Math.random() * 101) % 2 === 0) {
        nieuweDeelnemer.gender = 'female';
        nieuweDeelnemer.driver = 'Bijrijder';
      }
      // if (Math.floor(Math.random() * 101) % 2 === 0) {
      //   nieuweDeelnemer.driver = 'Bijrijder';
      // }
      Deelnemer.create(nieuweDeelnemer, (err, deelnemer) => {
        if (err) {
          console.log('Er ging iets fout bij het maken van de deelnemer');
        }
      });
    }
    //   User.remove({}, function(err) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       bcrypt.genSalt(10, function(err, salt) {
    //         bcrypt.hash('1234', salt, function(err, hash) {
    //           User.create({ name: 'Admin', role: 'Admin', hash: hash }, function(err, user) {
    //             if (err) {
    //               console.log('Kon admin niet aanmaken');
    //             }
    //           });
    //         });
    //       });
    //     }
    //   });
  }
};

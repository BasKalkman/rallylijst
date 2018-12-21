var express = require('express'),
  router = express.Router({ mergeParams: true }),
  Deelnemer = require('../models/Deelnemer'),
  Rit = require('../models/Ritten'),
  requireLogin = require('../requireLogin'),
  indeling = require('../indelingFunctions');

// DEELNEMERSLIJST
router.get('/deelnemers', requireLogin, (req, res) => {
  Deelnemer.find({})
    .sort({ name: 1 })
    .exec(function(err, deelnemers) {
      if (err) {
        console.log('Kan deelnemers niet overzetten');
      } else {
        res.render('deelnemerslijst', { deelnemers: deelnemers });
      }
    });
});

// AUTO INDELING
router.get('/indeling', requireLogin, (req, res) => {
  Rit.findOne({}, (err, ritten) => {
    let ritIndeling = [];
    let numRondes = 0;
    let numRijders = 0;
    let numBijrijders = 0;
    if (!err && ritten.rit.length !== 0) {
      ritIndeling = JSON.parse(ritten.rit[ritten.rit.length - 1]);
      numRondes = ritten.rit.length;
      ritIndeling.forEach(auto => {
        numRijders++;
        numBijrijders += auto.bijrijder.length;
      });
    }
    res.render('indeling', {
      indeling: ritIndeling,
      numRondes: numRondes,
      numRijders: numRijders,
      numBijrijders: numBijrijders
    });

    // Onderstaande DB query is volgens mij niet meer nodig. Nog even laten staan tot doorgetest
    // Deelnemer.find({ present: 'aanwezig' })
    //   .sort({ age: 1 })
    //   .exec(function(err, deelnemers) {
    //     if (err) {
    //       console.log('Er ging iets mis met aanwezige deelnemers');
    //     } else {
    //       res.render('indeling', {
    //         deelnemers: deelnemers,
    //         indeling: ritIndeling,
    //         numRondes: numRondes,
    //         numRijders: numRijders,
    //         numBijrijders: numBijrijders
    //       });
    //     }
    //   });
  });
});

// BEKIJK RONDE
router.get('/bekijkIndeling/:id', requireLogin, (req, res) => {
  Rit.findOne({}, (err, ritten) => {
    let rondeNummer = req.params.id;
    let numRijders = 0;
    let numBijrijders = 0;
    let indeling = JSON.parse(ritten.rit[req.params.id - 1]);
    indeling.forEach(auto => {
      numRijders++;
      numBijrijders += auto.bijrijder.length;
    });
    res.render('ronde', {
      indeling: indeling,
      rondeNummer: rondeNummer,
      numRijders: numRijders,
      numBijrijders: numBijrijders
    });
  });
});

// SHOW - Overzicht deelnemers gegevens
router.get('/deelnemer/:id', requireLogin, (req, res) => {
  Deelnemer.findOne({ _id: req.params.id })
    .populate('partners')
    .exec((err, deelnemer) => {
      if (err) {
        console.log('Fout bij ophalen deelnemer');
      } else {
        res.render('deelnemer', { deelnemer: deelnemer });
      }
    });
});

// UPDATE DEELNEMER - Naam, leeftijd, vooral aanwezigheid
router.put('/deelnemer/:id', requireLogin, (req, res) => {
  Deelnemer.findOneAndUpdate({ _id: req.params.id }, req.body.deelnemer, (err, result) => {
    if (err) {
      console.log('Kon niet wijzigen');
    } else {
      res.redirect('/deelnemers');
    }
  });
});

// OPHALEN
router.get('/ophalen', requireLogin, (req, res) => {
  Deelnemer.find({ present: 'aanwezig' })
    .sort({ age: -1 })
    .exec(function(err, deelnemers) {
      if (err) {
        console.log('Er ging iets mis met fetchen');
      } else {
        res.json(deelnemers);
      }
    });
});

// Indeling maken
// TODO: Vertoningspagina maken
router.get('/maakIndeling', requireLogin, (req, res) => {
  Deelnemer.find({ present: 'aanwezig' }, (err, deelnemers) => {
    // Indeling maken. Functies in indelingFuncties.js
    let ritIndeling = indeling.maken(deelnemers);
    // DB Updaten wie bij wie in de auto zat.
    ritIndeling.forEach(auto => {
      Deelnemer.findOneAndUpdate(
        { _id: auto.rijder._id },
        { $push: { partners: { $each: auto.bijrijder } } },
        err => {}
      );
      auto.bijrijder.forEach(bijrijder => {
        Deelnemer.findOneAndUpdate({ _id: bijrijder._id }, { $push: { partners: auto.rijder } }, err => {});
      });
    });
    // Ritindeling naar DB schrijven om later te bekijken
    let pushIndeling = JSON.stringify(ritIndeling);
    Rit.findOne({}, (err, ritten) => {
      if (!err) {
        ritten.rit.push(pushIndeling);
        ritten.save();
      }
    });
    // Pagina laden en indeling tonen
    res.redirect('/indeling');
  });
});

module.exports = router;

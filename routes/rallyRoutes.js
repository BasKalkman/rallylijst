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
  Deelnemer.find({ present: 'aanwezig' })
    .sort({ age: 1 })
    .exec(function(err, deelnemers) {
      if (err) {
        console.log('Er ging iets mis met aanwezige deelnemers');
      } else {
        res.render('indeling', { deelnemers: deelnemers });
      }
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

// Indeling verwerken in DB
router.post('/verwerkIndeling', requireLogin, (req, res) => {
  req.body.forEach(auto => {
    Deelnemer.findOne({ _id: auto.rijder._id }, (err, rijder) => {
      auto.bijrijder.forEach(bijrijder => {
        rijder.partners.push(bijrijder);
      });
      rijder.save();
    });
    auto.bijrijder.forEach(bijrijder => {
      Deelnemer.findOne({ _id: bijrijder._id }, (err, bijrijder) => {
        bijrijder.partners.push(auto.rijder);
        bijrijder.save();
      });
    });
  });
  let indeling = req.body;
  res.json(indeling);
});

// Indeling maken
// TODO: Naar DB schrijven
// TODO: Rit opslaan
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

    // Pagina laden en indeling tonen
    res.render('indeling', { indeling: ritIndeling });
  });
});

module.exports = router;

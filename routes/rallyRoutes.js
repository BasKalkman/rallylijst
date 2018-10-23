var express = require('express'),
  router = express.Router({ mergeParams: true }),
  Deelnemer = require('../models/Deelnemer'),
  requireLogin = require('../requireLogin');

// DEELNEMERSLIJST
router.get('/deelnemers', (req, res) => {
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
router.get('/indeling', (req, res) => {
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
  Deelnemer.findOne({ _id: req.params.id }, (err, deelnemer) => {
    if (err) {
      console.log('Fout bij ophalen deelnemer');
    } else {
      res.render('deelnemer', { deelnemer: deelnemer });
    }
  });
});

// UPDATE DEELNEMER - Naam, leeftijd, vooral aanwezigheid
router.put('/deelnemer/:id', (req, res) => {
  Deelnemer.findOneAndUpdate({ _id: req.params.id }, req.body.deelnemer, (err, result) => {
    if (err) {
      console.log('Kon niet wijzigen');
    } else {
      res.redirect('/deelnemers');
    }
  });
});

// OPHALEN
router.get('/ophalen', (req, res) => {
  Deelnemer.find({ present: 'aanwezig' })
    .sort({ age: 1 })
    .exec(function(err, deelnemers) {
      if (err) {
        console.log('Er ging iets mis met fetchen');
      } else {
        res.json(deelnemers);
      }
    });
});

module.exports = router;

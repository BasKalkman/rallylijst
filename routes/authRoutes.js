var mongoose = require('mongoose'),
  User = require('../models/User'),
  express = require('express'),
  router = express.Router({ mergeParams: true }),
  bcrypt = require('bcryptjs'),
  requireLogin = require('../requireLogin'),
  requireAdmin = require('../requireAdmin');

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', requireLogin, requireAdmin, (req, res) => {
  res.render('register');
});

router.post('/register', requireLogin, requireAdmin, (req, res) => {
  res.send('Register post route');
});

router.post('/login', (req, res) => {
  User.findOne({ name: req.body.user.name }, function(err, user) {
    if (err) {
      console.log('Kon gebruiker niet vinden of ophalen');
      res.redirect('/login');
    } else if (!user) {
      console.log('Gebruiker niet gevonden');
      res.redirect('/login');
    } else {
      bcrypt.compare(req.body.user.password, user.hash, function(err, result) {
        if (err) {
          console.log(err);
        } else if (!result) {
          res.redirect('/login');
        } else {
          // LOGIN GELUKT
          user.password = '';
          req.rallySession.user = user;
          res.redirect('/deelnemers');
        }
      });
    }
  });
});

router.get('/logout', (req, res) => {
  req.rallySession.reset();
  res.redirect('/login');
});

module.exports = router;

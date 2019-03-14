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
  bcrypt.genSalt(12, function(err, salt) {
    bcrypt.hash(req.body.user.password, salt, function(err, hash) {
      User.create({ name: req.body.user.name, role: req.body.user.role, hash: hash }, function(err, newUser) {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/admin');
        }
      });
    });
  });
});

router.post('/login', (req, res) => {
  console.log(req.fields);
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

// ADMIN USERS
router.get('/admin', requireLogin, requireAdmin, (req, res) => {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('admin', { users: users });
    }
  });
});

router.get('/user/:id', requireLogin, requireAdmin, (req, res) => {
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('user', { gebruiker: user });
    }
  });
});

router.put('/user/:id', requireLogin, requireAdmin, (req, res) => {
  if (req.body.user.password.length === 0) {
    User.findOneAndUpdate({ _id: req.params.id }, { name: req.body.user.name, role: req.body.user.role }, function(
      err,
      userUpdate
    ) {
      res.redirect('/admin');
    });
  } else {
    bcrypt.genSalt(12, function(err, salt) {
      bcrypt.hash(req.body.user.password, salt, function(err, hash) {
        User.findOneAndUpdate(
          { _id: req.params.id },
          { name: req.body.user.name, role: req.body.user.role, hash: hash },
          function(err, updatedUser) {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/admin');
            }
          }
        );
      });
    });
  }
});

router.delete('/user/:id', requireLogin, requireAdmin, (req, res) => {
  User.findOneAndDelete({ _id: req.params.id }, function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/admin');
    }
  });
});

module.exports = router;

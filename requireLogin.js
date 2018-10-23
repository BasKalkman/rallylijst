var mongoose = require('mongoose'),
  User = require('./models/User');

function requireLogin(req, res, next) {
  if (req.rallySession && req.rallySession.user) {
    User.findOne({ name: req.rallySession.user.name }, (err, user) => {
      if (!user) {
        req.rallySession.reset();
        res.redirect('/login');
      } else {
        user.password = '';
        res.locals.user = user;
        req.rallySession.user = user;
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
}

module.exports = requireLogin;

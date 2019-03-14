var mongoose = require('mongoose'),
  User = require('../models/User'),
  express = require('express'),
  router = express.Router({ mergeParams: true }),
  bcrypt = require('bcryptjs'),
  requireLogin = require('../requireLogin'),
  requireAdmin = require('../requireAdmin'),
  fs = require('fs');

router.get('/uploadCSV', requireLogin, (req, res) => {
  res.render('uploadCSV');
});

router.post('/uploadCSV', requireLogin, (req, res) => {
  console.log(req.files.file.path);
  let test = req.files.file.path;
  let meh = fs.readFileSync(test, 'utf-8');
  console.log(meh);
});

module.exports = router;

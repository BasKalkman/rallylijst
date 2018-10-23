// PRODUCTION TODO
// - Remove this
// - In Deelnemer model, present default is --
// - requireLogin middleware op alle routes
// - rallySession key naar env
// - MIDDLEWARE ucommenten

// MODULES
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  bcrypt = require('bcryptjs'),
  session = require('client-sessions'),
  seed = require('./seed'),
  requireLogin = require('./requireLogin');

// MONGOOSE
mongoose.connect(
  'mongodb://localhost/rally',
  { useNewUrlParser: true }
);

// MODELS
var Deelnemer = require('./models/Deelnemer');
var User = require('./models/User');

// ROUTES
var authRoutes = require('./routes/authRoutes');

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

// COOKIE SETTINGS
app.use(
  session({
    cookieName: 'rallySession',
    secret: 'langeTestKeyTeVervangen',
    duration: 1000 * 60 * 60 * 24
  })
);

// MIDDLEWARE
app.use();

// SEED
// seed.seedDB();
// RESEED
app.get('/reseed', (req, res) => {
  seed.seedDB();
  res.redirect('/indeling');
});

// ROUTES
app.get('/', (req, res) => {
  res.render('index');
});

// DEELNEMERSLIJST
app.get('/deelnemers', (req, res) => {
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
app.get('/indeling', (req, res) => {
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
app.get('/deelnemer/:id', requireLogin, (req, res) => {
  Deelnemer.findOne({ _id: req.params.id }, (err, deelnemer) => {
    if (err) {
      console.log('Fout bij ophalen deelnemer');
    } else {
      res.render('deelnemer', { deelnemer: deelnemer });
    }
  });
});

// UPDATE DEELNEMER - Naam, leeftijd, vooral aanwezigheid
app.put('/deelnemer/:id', (req, res) => {
  Deelnemer.findOneAndUpdate({ _id: req.params.id }, req.body.deelnemer, (err, result) => {
    if (err) {
      console.log('Kon niet wijzigen');
    } else {
      res.redirect('/deelnemers');
    }
  });
});

// OPHALEN
app.get('/ophalen', (req, res) => {
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

// LOGIN / LOGOUT
app.use(authRoutes);

// 404
app.get('*', (req, res) => {
  res.status(404);
  res.send('404 - Unable to find that page');
});

// START SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log('Rally server started');
});

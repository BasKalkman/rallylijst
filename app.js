// PRODUCTION TODO
// - Remove this
// - In Deelnemer model, present default is --
// - requireLogin middleware op alle routes
// - rallySession key naar env

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
var rallyRoutes = require('./routes/rallyRoutes');

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
    duration: 1000 * 60 * 60 * 24,
    httpOnly: true
  })
);

// MIDDLEWARE
app.use(function(req, res, next) {
  res.locals.user = req.rallySession.user;
  next();
});

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

// RALLY ROUTES
app.use(rallyRoutes);

// LOGIN / LOGOUT
app.use(authRoutes);

// INDELING ROUTES -- MOMENTEEL VIA MAIN.JS
// app.get('/maakIndeling', (req, res) => {
//   Deelnemer.find({ present: 'aanwezig', driver: 'Rijder', gender: 'male' }, (err, rijdersMan) => {
//     Deelnemer.find({ present: 'aanwezig', driver: 'Bijrijder', gender: 'male' }, (err, bijrijdersMan) => {
//       Deelnemer.find({ present: 'aanwezig', driver: 'Rijder', gender: 'female' }, (err, rijdersVrouw) => {
//         Deelnemer.find({ present: 'aanwezig', driver: 'Bijrijder', gender: 'female' }, (err, bijrijdersVrouw) => {
//           // Variabele opgehaald, nu de logica nog
//         });
//       });
//     });
//   });
// });

// 404
app.get('*', (req, res) => {
  res.status(404);
  res.send('404 - Unable to find that page');
});

// START SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log('Rally server started');
});

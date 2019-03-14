// PRODUCTION TODO
// - Remove this
// - In Deelnemer model, present default is --
// - requireLogin middleware op alle routes
// - rallySession key naar env

// TODO
// - Init van activiteit, alles leeg maken en DB aanmaken

// MODULES
var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  methodOverride = require('method-override'),
  bcrypt = require('bcryptjs'),
  session = require('client-sessions'),
  seed = require('./seed'),
  requireLogin = require('./requireLogin'),
  formidableMiddleware = require('express-formidable'),
  fs = require('fs');

// ENV
require('dotenv').config();

// MONGOOSE
mongoose.connect(process.env.DB_TEST, { useNewUrlParser: true });

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
app.use(
  formidableMiddleware({
    encoding: 'utf-8',
    uploadDir: './tmp'
  })
);

// COOKIE SETTINGS
app.use(
  session({
    cookieName: 'rallySession',
    secret: process.env.COOKIE_SECRET,
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

// CSV
app.get('/uploadCSV', requireLogin, (req, res) => {
  res.render('uploadCSV');
});

app.post('/uploadCSV', requireLogin, (req, res) => {
  console.log(req.files.file.path);
  let test = req.files.file.path;
  let meh = fs.readFileSync(test, 'utf-8');
  console.log(meh);
});

// 404
app.get('*', (req, res) => {
  res.status(404);
  res.send('404 - Unable to find that page');
});

// START SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log('Rally server started');
});

// MODULES
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    bcrypt = require('bcryptjs'),
    session = require('cookie-session'),
    seed = require('./seed');

// MONGOOSE
mongoose.connect('mongodb://localhost/rally', {useNewUrlParser: true});

// MODELS
var Deelnemer = require('./models/Deelnemer');

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname +'/public'))

// SEED
// seed.seedDB()

// ROUTES
app.get('/', (req, res) => {
    Deelnemer.find({}, (err, deelnemers) => {
        if (err) {console.log('Kan deelnemers niet overzetten')}
        else {res.render('index', {deelnemers: deelnemers}) }
    })
})

// 404 
app.get('*', (req, res) => {
    res.send('404 - Unable to find that page')
})

// START SERVER 
app.listen(process.env.PORT || 3000, () => {
    console.log('Rally server started')
})
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

var test = {
    log: function(x) {
        console.log(x)
    }
}

// ROUTES
app.get('/', (req, res) => {
    res.render('index')
})

// DEELNEMERSLIJST
app.get('/deelnemers', (req, res) => {
    Deelnemer.find({})
        .sort({name: 1})
        .exec(function(err, deelnemers) {
            if (err) {console.log('Kan deelnemers niet overzetten')}
            else {res.render('deelnemerslijst', {deelnemers: deelnemers}) }
        })
})

app.get('/indeling', (req, res) => {
    Deelnemer.find({present: 'aanwezig'}, (err, deelnemers) => {
        if (err) {
            console.log('Er ging iets mis met aanwezige deelnemers');
        } else {
            res.render('indeling', {deelnemers: deelnemers, test: test})
        }
    })
})

// SHOW - Overzicht deelnemers gegevens
app.get('/deelnemer/:id', (req, res) => {
    Deelnemer.findOne({_id: req.params.id}, (err, deelnemer) => {
        if (err) { console.log('Fout bij ophalen deelnemer') }
        else { res.render('deelnemer', {deelnemer: deelnemer})}
    })
})

// UPDATE DEELNEMER - Naam, leeftijd, vooral aanwezigheid
app.put('/deelnemer/:id', (req, res) => {
    Deelnemer.findOneAndUpdate({ _id: req.params.id}, req.body.deelnemer, (err, result) => {
        if (err) {
            console.log('Kon niet wijzigen'); 
        } else {
            res.redirect('/deelnemers');
        }
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
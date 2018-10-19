var mongoose = require('mongoose');

var deelnemerSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    driver: String,
    seats: Number
})

module.exports = mongoose.model('Deelnemer', deelnemerSchema);
var mongoose = require('mongoose');

var deelnemerSchema = new mongoose.Schema({
    name: String,
    gender: String,
    age: Number,
    driver: String,
    seats: Number,
    present: {type: String, default: '--'},
    doubled: {type: Number, default: 0}
})

module.exports = mongoose.model('Deelnemer', deelnemerSchema);
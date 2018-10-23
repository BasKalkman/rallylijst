var mongoose = require('mongoose'),
  Deelnemer = require('./Deelnemer');

var rittenSchema = new mongoose.Schema({
  rit1: Array
});

module.exports = mongoose.model('Ritten', rittenSchema);

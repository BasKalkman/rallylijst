var mongoose = require('mongoose'),
  Deelnemer = require('./Deelnemer');

var rittenSchema = new mongoose.Schema({
  rit: [String]
});

module.exports = mongoose.model('Rit', rittenSchema);

var mongoose = require('mongoose'),
  Deelnemer = require('./Deelnemer');

var rittenSchema = new mongoose.Schema({
  rit: { type: Number, default: 1 },
  indeling: { type: String }
});

module.exports = mongoose.model('Rit', rittenSchema);

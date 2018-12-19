var mongoose = require('mongoose'),
  Deelnemer = require('./Deelnemer');

var rittenSchema = new mongoose.Schema({
  rit: { type: Array }
});

module.exports = mongoose.model('Rit', rittenSchema);

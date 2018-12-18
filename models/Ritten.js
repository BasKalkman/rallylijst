var mongoose = require('mongoose'),
  Deelnemer = require('./Deelnemer');

var rittenSchema = new mongoose.Schema({
  ritten: { type: Array }
});

module.exports = mongoose.model('Ritten', rittenSchema);

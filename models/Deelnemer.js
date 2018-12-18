var mongoose = require('mongoose');

var deelnemerSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
  driver: String,
  seats: { type: Number, default: 2 },
  phone: { type: String, default: 0 },
  present: { type: String, default: 'aanwezig' },
  doubled: { type: Number, default: 0 },
  partners: { type: Array, default: [] }
});

module.exports = mongoose.model('Deelnemer', deelnemerSchema);

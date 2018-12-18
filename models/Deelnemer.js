var mongoose = require('mongoose');

var deelnemerSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
  driver: String,
  seats: { type: Number, default: 2 },
  phone: { type: String, default: 0 },
  present: { type: String, default: 'aanwezig' },
  partners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deelnemer' }],
  doubled: { type: Number, default: 0 }
});

module.exports = mongoose.model('Deelnemer', deelnemerSchema);

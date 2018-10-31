var mongoose = require('mongoose');

var deelnemerSchema = new mongoose.Schema({
  name: String,
  gender: String,
  age: Number,
  driver: String,
  seats: Number,
  phone: String,
  present: { type: String, default: 'aanwezig' },
  doubled: { type: Number, default: 0 },
  partners: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deelnemer'
  }
});

module.exports = mongoose.model('Deelnemer', deelnemerSchema);

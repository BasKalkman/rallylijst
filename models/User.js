var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  role: { type: String, default: 'Gebruiker' },
  hash: String
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  testo: { type: String, required: true },
  autore: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
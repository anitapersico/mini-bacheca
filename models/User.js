// Importo mongoose, la libreria che collega Node.js a MongoDB
const mongoose = require('mongoose');

// Lo "schema" è lo stampo: dice che forma deve avere ogni utente salvato
const userSchema = new mongoose.Schema({
  // Email: testo, obbligatoria, e non possono esistere due utenti con la stessa
  email: { type: String, required: true, unique: true },
  // Password: testo, obbligatoria (verrà salvata già trasformata con bcrypt, mai in chiaro)
  password: { type: String, required: true },
});

// Creo il Model "User" a partire dallo schema e lo rendo disponibile agli altri file
// MongoDB salverà gli utenti in una collezione chiamata "users" (automatico: minuscolo e plurale)
module.exports = mongoose.model('User', userSchema);
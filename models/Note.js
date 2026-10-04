// Importo mongoose, la libreria che collega Node.js a MongoDB
const mongoose = require('mongoose');

// Lo "schema" è lo stampo: dice che forma deve avere ogni appunto salvato
const noteSchema = new mongoose.Schema(
  {
    // Testo dell'appunto: obbligatorio
    testo: { type: String, required: true },

    // Autore: invece di scrivere il nome come testo, salvo l'ID dell'utente che ha creato l'appunto
    // "ref: 'User'" dice a Mongoose che quell'ID fa riferimento a un documento della collezione users
    // Così ogni appunto è collegato alla persona giusta
    autore: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  // timestamps: true aggiunge in automatico due campi: createdAt (quando è stato creato)
  // e updatedAt (quando è stato modificato l'ultima volta)
  { timestamps: true }
);

// Creo il Model "Note" a partire dallo schema e lo rendo disponibile agli altri file
// MongoDB salverà gli appunti in una collezione chiamata "notes"
module.exports = mongoose.model('Note', noteSchema);
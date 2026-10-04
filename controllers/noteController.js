// Importo il Model Note (per parlare con la collezione "notes" nel database)
const Note = require('../models/Note');

// LEGGI: restituisce solo gli appunti dell'utente loggato
const getNotes = async (req, res) => {
  try {
    // Cerco gli appunti dove "autore" è uguale all'id dell'utente che fa la richiesta
    // req.userId lo ha messo il middleware leggendo il token
    const notes = await Note.find({ autore: req.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ messaggio: err.message });
  }
};

// CREA: salva un nuovo appunto collegato all'utente loggato
const createNote = async (req, res) => {
  try {
    // Prendo il testo dai dati della richiesta
    const { testo } = req.body;

    // Creo l'appunto. L'autore NON lo prendo dalla richiesta (sarebbe falsificabile),
    // ma da req.userId, che arriva dal token verificato
    const newNote = new Note({ testo, autore: req.userId });
    const saved = await newNote.save();

    // 201 = creato con successo
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ messaggio: err.message });
  }
};

// MODIFICA: cambia il testo di un appunto, ma solo se è tuo
const updateNote = async (req, res) => {
  try {
    // Cerco un appunto con quell'id E con te come autore
    // Se l'appunto esiste ma è di un altro utente, non lo trovo e non posso toccarlo
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, autore: req.userId },
      { testo: req.body.testo },
      { new: true } // restituisce la versione aggiornata, non quella vecchia
    );

    if (!note) {
      // 404 = non trovato (o non è tuo)
      return res.status(404).json({ messaggio: "Appunto non trovato" });
    }

    res.json(note);
  } catch (err) {
    res.status(400).json({ messaggio: err.message });
  }
};

// CANCELLA: elimina un appunto, ma solo se è tuo
const deleteNote = async (req, res) => {
  try {
    // Stessa logica: id giusto E autore giusto
    const note = await Note.findOneAndDelete({ _id: req.params.id, autore: req.userId });

    if (!note) {
      return res.status(404).json({ messaggio: "Appunto non trovato" });
    }

    res.json({ messaggio: "Appunto eliminato" });
  } catch (err) {
    res.status(500).json({ messaggio: err.message });
  }
};

// Rendo disponibili le funzioni agli altri file
module.exports = { getNotes, createNote, updateNote, deleteNote };
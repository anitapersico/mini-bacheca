const express = require('express');
const router = express.Router();

// Importo le quattro funzioni del controller degli appunti
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');

// Importo il "buttafuori" che controlla il token
const protect = require('../middleware/authMiddleware');

// Metto "protect" PRIMA di ogni funzione: Express lo esegue per primo,
// e solo se chiama next() passa alla funzione del controller

// GET /api/notes → leggi i miei appunti
router.get('/', protect, getNotes);

// POST /api/notes → crea un appunto
router.post('/', protect, createNote);

// PUT /api/notes/:id → modifica un mio appunto
router.put('/:id', protect, updateNote);

// DELETE /api/notes/:id → cancella un mio appunto
router.delete('/:id', protect, deleteNote);

module.exports = router;
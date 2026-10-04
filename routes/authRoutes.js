// Importo express per creare un "mini menù" di indirizzi
const express = require('express');
const router = express.Router();

// Importo le due funzioni scritte nel controller di autenticazione
const { register, login } = require('../controllers/authController');

// POST /api/auth/register → chiama la funzione register
router.post('/register', register);

// POST /api/auth/login → chiama la funzione login
router.post('/login', login);

// Rendo disponibile il menù agli altri file
module.exports = router;
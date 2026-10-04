// Importo il Model User (per parlare con la collezione "users" nel database)
const User = require('../models/User');
// bcrypt serve per trasformare le password in codice illeggibile (hash)
const bcrypt = require('bcryptjs');
// jwt serve per creare il "biglietto" (token) che dimostra che l'utente è loggato
const jwt = require('jsonwebtoken');

// REGISTRAZIONE: crea un nuovo utente
const register = async (req, res) => {
  try {
    // Prendo email e password dai dati che arrivano nella richiesta
    const { email, password } = req.body;

    // Cerco se esiste già un utente con questa email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Se esiste, mi fermo e rispondo con errore 400 (richiesta sbagliata)
      return res.status(400).json({ messaggio: "Email già registrata" });
    }

    // Trasformo la password in un codice illeggibile (il 10 indica quanto è "complicato" il calcolo)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creo il nuovo utente, salvando la password "trasformata", mai quella vera
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // 201 = creato con successo
    res.status(201).json({ messaggio: "Utente registrato con successo" });
  } catch (err) {
    // Se qualcosa va storto (es. database non raggiungibile), rispondo con errore 500
    res.status(500).json({ messaggio: err.message });
  }
};

// LOGIN: controlla le credenziali e restituisce il token
const login = async (req, res) => {
  try {
    // Prendo email e password dai dati che arrivano nella richiesta
    const { email, password } = req.body;

    // Cerco l'utente con questa email nel database
    const user = await User.findOne({ email });
    if (!user) {
      // Non specifico se è sbagliata l'email o la password, per sicurezza
      return res.status(400).json({ messaggio: "Credenziali non valide" });
    }

    // Confronto la password scritta con quella salvata (trasformata) nel database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ messaggio: "Credenziali non valide" });
    }

    // Credenziali giuste: creo il token, con dentro l'id dell'utente
    // Lo "firmo" con la chiave segreta del .env e scade dopo 7 giorni
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Mando il token al client, che lo userà nelle richieste successive
    res.json({ messaggio: "Login riuscito", token });
  } catch (err) {
    res.status(500).json({ messaggio: err.message });
  }
};

// Rendo disponibili le due funzioni agli altri file
module.exports = { register, login };